// sources/common/view/elements/page/RUX_PagePanel_ReactDebug.jsx
//

const React = require('react');
const reactComponentBindingFilterFactory = require('../binding-factory');

var factoryResponse = reactComponentBindingFilterFactory.create({

    id: "6q1nwXxaSWa6lCp1wCAB3Q",
    name: "RUXBase_PagePanel_ReactDebug",
    description: "<RUXBase_PagePanel_ReactDebug/> React Component Binding",
    renderDataBindingSpec: {
    ____types: "jsObject",
        RUXBase_PagePanel_ReactDebug: {
            ____types: "jsObject",
            options: {
                ____accept: "jsObject",
                ____defaultValue: {}
            }
        }
    },
    reactComponent: React.createClass({
        displayName: "RUXBase_PagePanel_ReactDebug",

        getInitialState: function() {
            return ({
                showDetails: false,
                showDocumentData: false,
                showAppDataStore: false,
                showAppStateController: false,
                showMetadataStore: false
            });
        },

        onClickToggleDetails: function() {
            this.setState({ showDetails: !this.state.showDetails });
        },

        onClickToggleDetailsSection: function(sectionName) {
            var state = this.state;
            state[sectionName] = !state[sectionName];
            this.setState(state);
        },

        render: function() {
            var self = this;
            var ComponentRouter = this.props.appStateContext.reactComponentRouter;
            const metadata = this.props.document.metadata;
            const theme = metadata.site.theme;
            const renderData = this.props.renderData['RUXBase_PageContent_Error'];
            var keyIndex = 0;
            function makeKey() { return ("RUXBase_PagePanel_ReactDebug" + keyIndex++); }
            var content = [];

            if (!this.state.showDetails) {
                content.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_ReactDebug.closed.container}>
                             <img src='/advertise/rainier/images/react-logo.svg' style={theme.base.RUXBase_PagePanel_ReactDebug.closed.icon} onClick={this.onClickToggleDetails} title="Show React JSON..."/>
                             </div>);
            } else {
                content.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_ReactDebug.closed.container}>
                             <img src='/advertise/rainier/images/react-logo.svg' style={theme.base.RUXBase_PagePanel_ReactDebug.closed.iconDisabled} onClick={this.onClickToggleDetails} title="Hide React JSON..."/>
                             </div>);

                var details = [];

                details.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_ReactDebug.open.hideDetails} onClick={this.onClickToggleDetails} title="Hide React JSON...">
                             <img src='/advertise/rainier/images/react-logo.svg' style={theme.base.RUXBase_PagePanel_ReactDebug.open.icon}/>
                             In-Page React Data Viewer :: {metadata.page.name}</div>);

                details.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_ReactDebug.open.guidance}>
                             <p>To debug a rendering issue with a specific React component, set a breakpoint in its render method (or possibly lifecycle method(s)). Step through your view rendering logic to find errors handling input(s). Check your subcomponent delegations and specific values passed.</p>
                             <p>To debug page-level layout rendering problems, set a breakpoint in the render method of <strong>&lt;ComponentRouter/&gt;</strong>. Inspect the React component selected and specific data value(s) bound to the selected component before the call is delegated.</p>
                             </div>);

                details.push(<p key={makeKey()}><strong>Click each section title below to toggle JSON view...</strong></p>);

                details.push(<h3 key={makeKey()} onClick={function() { self.onClickToggleDetailsSection('showDocumentData');}} style={{cursor:'pointer'}}>
                             {(this.state.showDocumentData?'-':'+')}
                             {' '}this.props.document
                             </h3>);
                if (this.state.showDocumentData)
                    details.push(<pre key={makeKey()} style={theme.classPRE}>this.props.document === '{JSON.stringify(this.props.document, undefined, 4)}'</pre>);


                details.push(<h3 key={makeKey()} onClick={function() { self.onClickToggleDetailsSection('showAppDataStore'); }} style={{cursor:'pointer'}}>
                             {(this.state.showAppDataStore?'-':'+')}
                             {' '}this.props.appStateContext.appDataStore
                             </h3>);
                if (this.state.showAppDataStore)
                    details.push(<pre key={makeKey()} style={theme.classPRE}>this.props.appStateContext.appDataStore === '{JSON.stringify(this.props.appStateContext.appDataStore, undefined, 4)}'</pre>);

                details.push(<h3 key={makeKey()} onClick={function() { self.onClickToggleDetailsSection('showMetadataStore'); }} style={{cursor:'pointer'}}>
                             {(this.state.showMetadataStore?'-':'+')}
                             {' '}this.props.appStateContext.appMetadataStore
                             </h3>);

                if (this.state.showMetadataStore)
                    details.push(<pre key={makeKey()} style={theme.classPRE}>this.props.appStateContext.appMetadataStore === '{this.props.appStateContext.appMetadataStore.stringify(undefined, 4)}</pre>);

                details.push(<h3 key={makeKey()} onClick={function() { self.onClickToggleDetailsSection('showAppStateController'); }} style={{cursor:'pointer'}}>
                             {(this.state.showAppStateController?'-':'+')}
                             {' '}this.props.appStateContext.appStateController
                             </h3>);

                if (this.state.showAppStateController)
                    details.push(<pre key={makeKey()} style={theme.classPRE}>this.props.appStateContext.appStateController === '{JSON.stringify(this.props.appStateContext.appStateController, undefined, 4)}</pre>);

                content.push(<div key={makeKey()} style={theme.base.RUXBase_PagePanel_ReactDebug.open.container}>{details}</div>);

            }

            return (<div>{content}</div>);
        }
    })
});
if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
