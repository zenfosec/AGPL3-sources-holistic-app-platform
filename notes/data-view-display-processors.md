ThemeProcessor is not super complex in terms of its CellModel definition which makes a good example to play around with for learning.
We have discussed the idea of representing, generally (i.e. everything) as architectural black boxes that are presumed to be stateful (i.e. each black box has its own private memory that is used by logic inside the black box to store information that is later combined with request inputs to determine the black box's output).
It's super important to understand the low-level mechanics of how / why this model is built the way it is. Specifically, this example has motivated the discussion about "push" vs "pull" dataflow.
I have always had trouble getting everyone to agree on the meaning of "upstream" and "downstream" when discussing data flow architectures. I try to use these terms consistently as follows:
Visualize the flow of information (data) as a stream of water that runs from upstream to downstream in a downhill direction between little ponds.
Depending on context, we may refer to upstream as the source, downstream as the sink of information (source and sink are terms of art in digital circuits).
Broadly, ThemeProcessor defines a data specification and semantics for a "theme" which is a JSON document containing labeled data values to be passed through d2r2 to React components via this.props.TBD so that all React components can dynamically apply the current styling options (which are dynamic) in a consistent manner. And, so that we can easily use shared and custom d2r2 components together without worrying about styling (they will all use the same conventions and understanding of the label semantics (i.e. namespace addresses inside the theme JSON document)  to obtain the actual programmatic style values to be applied in a React component's render method).
We have not yet defined the format for vNext d2r2 this.props at this point: this is a work in progress. We know quite a bit about the top-level shape of this.props however.

Specifically we know that this.props is and will always be a descriptor object (i.e. an object w/predefined key names i.e. not a dictionary). And, we know the <ComponentRouter/> uses a discriminator that discriminates based on examination of this.props.renderData
One of several mid-term goals is to define and lock down the filter specification for all d2r2 messages sent to <ComponentRouter/> for all applications that derive from @encapsule/holistic
This is necessary for several important reasons:
We intend to interface with React via @encapsule/d2r2. This "interface" is encapsulated in the @encapsule/holistic-app-client-cm RTL as exported CellModel "display adaptor" which is a simple CellModel that handles the details of:Calling ReactDOM to "hydrate" the client view given:Server rendered HTML5 content that contains special markers known only to React embedded in the server-rendered content via ReactDOMA copy of the full this.props passed to the root React component via ReactDOM on the serverCalling ReactDOM to "render" subsequent updates of the view while the client HTML5 application is running in memoryImportantly, "hydrate" happens once followed by however many "render" is required to affect updates to the information displayed to the user via the DOMOur application Viewpath5 has extreme UI performance requirements that require that we clearly separate concerns wrt display layout and content updatedisplay layout is an operation affected by @encapsule/d2r2 that parses an object, this.props, using Recursive Message Discriminated Routing (RMDR) (i.e. arccore.discriminator applied recursively) and a developer-defined grammar of transformer plug-ins (d2r2 components).<ComponentRouter/> is effectively an object parser and transcoding mechanism with a plug-in-extensible parser grammar, visitor pattern-based callback mechanism, and rigid function semantics for object transformer plug-in functions. That sounds kind of scary so we call it a "layout processor".So, given some arbitrary this.props and a <ComponentRouter/> instance that represents a specific RMDR parser configuration (i.e. the parser grammar (the data structures it knows how to identify) plus the specific actions to take when one of those structures is discovered in the this.props data) display layout is the process of parsing this.props in order to transform it into another data structure which is a tree of React Elements.React Element !== React Component: React Element is constructed by calling React.createElement passing in a reference to a React component and a reference to this.props that should be applied later by the React runtime.The entire process of parsing this.props through RMDR to deduce the React Element tree is relatively expensive in and of itself. But that's only one factor.Once we have transcoded this.props to a tree of React Elements the React runtime then takes this tree and applies it to the virtual DOM that it maintains.If the React Element tree does not comport with the React Element tree that was last applied to the virtual DOM (this is deduced using a bunch of tricky metrics by the React runtime e.g. the `key` property on DOM elements), then the contents of the virtual DOM is adjusted by the React runtime.Branches of the previous React Element tree that are not present in the new React Element tree are dismounted (i.e. previously mounted React component(s) on those branches will have their lifecycles ended)Branches of the new React Element tree that were not present in the previous React Element tree are mounted (i.e. lifecycle for your React Element is started - it's subtle and pretty obscure but if you think about it a React component is just a class - it's not an instance it's the instance's definition so you can think of the React Element as a React component instance that is bound so a specific node in the this.props data)RMDR transcoding + virtual DOM reconciliation are not for freeAll the processing has to be done on the primary JavaScript thread because React and DOM. This means that we have to ensure the following:Layout operations are as efficient as possible (i.e. we do not alter portions of the React Element tree through layout operations unnecessarily)We should work to NEVER actually force any of this layout evaluation to occur (neither RMDR transcode nor React evaluation of VDOM) in situations where completing the object parse/transformation of this.props into a new React Element tree will result in no diff in the React Element tree in virtual DOM. In this situation it's a complete waste of precious primary JavaScript thread time that we cannot afford for Viewpath5.content update is an operation affected by notifying previously mounted React Elements that they should re-render whatever information they display because some aspect of that information has changed.Inherently this is different than layout - here we have a React Element that was previously mounted in the virtual DOM (meaning that it is managing the contents of an actual DOM element). We are not asking to replace the actual DOM element or the React Element that renders it. Rather, we seek to replace the actual DOM element's innerHTML without impact to the React Element's lifecycle (i.e. we just want it to re-render new data).There are several ways that we could conceivably call methods on specific React component instances (React Element(s)). We will choose one and use it consistently.Worst case we can 