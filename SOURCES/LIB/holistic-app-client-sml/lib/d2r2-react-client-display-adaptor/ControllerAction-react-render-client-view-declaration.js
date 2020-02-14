// ControllerAction-react-render-client-view-declaration.js

const React = require("react");
const ReactDOM = require("react-dom");

module.exports = {
    id: "ENIOOasYSdmJj_RXjA__hQ",
    name: "d2r2/React Client Display Adaptor: Rydrate/Render",
    description: "Rehydrate and/or render/re-render client application view via d2r2/React transport using context and render data obtained from specified input paths in the OCD.",

    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                client: {
                    ____types: "jsObject",
                    sml: {
                        ____types: "jsObject",
                        actions: {
                            ____types: "jsObject",
                            d2r2ReactClientDisplayAdaptor: {
                                ____types: "jsObject",
                                operation: {
                                    ____accept: "jsString",
                                    ____inValueSet: [
                                        "hydrate", // Display updated via ReactDOM.hydrate (presumes page loaded with server-rendered HTML and we have the server-rendered boot ROM data)
                                        "render"   // Display updated via ReactDOM.render
                                    ],
                                    ____defaultValue: "render"
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: { ____accept: "jsUndefined" }, // no response.result


    bodyFunction: function(request_) {

        let response = { error: null, result: undefined /*no result*/ };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const message = request_.actionRequest.holistic.app.client.sml.actions.d2r2ReactClientDisplayAdaptor;

            // Resolve the full path to the d2r2 React Client Display Adaptor's input namespace.
            let rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                opmBindingPath: request_.context.opmBindingPath,
                dataPath: "#.inputs"
            });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const pathInputs = rpResponse.result;

            // Read the d2r2 React Client Display Adaptor's input namespace from the OCD.
            let ocdResponse = request_.context.ocdi.readNamespace(pathInputs);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const inputs = ocdResponse.result;

            // Resolve the full path to the specified d2r2 render context namespace.
            rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                opmBindingPath: request_.context.opmBindingPath,
                dataPath: inputs.clock.value.pathRenderContext
            });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const pathRenderContext = rpResponse.result;

            // Read the specified OCD namespace and use it as the d2r2 renderContext.
            ocdResponse = request_.context.ocdi.readNamespace(pathRenderContext);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            let renderContext = ocdResponse.result;

            // Resolve the full path to the specified d2r2 render context namespace.
            rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                opmBindingPath: request_.context.opmBindingPath,
                dataPath: inputs.clock.value.pathRenderData
            });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const pathRenderData = rpResponse.result;

            // Read the specifed OCD namespace and use it as the d2r2 renderData.
            ocdResponse = request_.context.ocdi.readNamespace(pathRenderData);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const renderData = ocdResponse.result;

            // ================================================================
            // ================================================================
            // ================================================================
            // THIS NEEDS TO BE REPLACED. WE WANT TO USE THE RAW DATA READ FROM
            // THE SPECIFIED RENDER CONTEXT AND RENDER DATA WITHOUT ANY MODIFICATION.
            // WE DO NOT WANT TO HAVE ANY KNOWLEDGE WHATEVER IN THIS MODEL ABOUT
            // THE FORMAT OF THESE MESSAGES.

            let legacyReactContext = {
                appStateContext: { // TODO: remove this especially
                    ComponentRouter: inputs.ComponentRouter
                },
                document: renderContext,
                renderData: renderData
            };

            // ================================================================
            // ================================================================
            // ================================================================

            const d2r2Component = React.createElement(inputs.ComponentRouter, legacyReactContext);

            const reactOperation = { hydrate: ReactDOM.hydrate /* https://reactjs.org/docs/react-dom.html#hydrate */,
                                     render: ReactDOM.render /* https://reactjs.org/docs/react-dom.html#render */
                                   }[message.operation];

            reactOperation(d2r2Component, inputs.DOMElement, function() {

                // TODO: What should an external actor, in this case React, do if a transport error
                // occurs when calling opci.act? I think it's reasonable to provide some sort of centralized
                // error reporting of any and all act call failures. What's tricky is that we would like
                // action plug-ins to be able to provide custom error handling (i.e. possibly not report
                // or report in some custom way). And, we would like to be able to not worry about failures
                // in cases such as this example (in theory this _should_ never fail but) knowing that
                // they will be reported via a standardized mechanism and as such will not slip by unnoticed.

                const actResponse = request_.context.act({
                    actorName: "d2r2/React Display Adaptor Update Completion Handler",
                    actorTaskDescription: `Signal completion of client application view via d2r2/React ${message.operation} operation.`,
                    actionRequest: { holarchy: { sml: { actions: { ocd: { clearBooleanFlag: { path: "#.private.renderPending" } } } } } },
                    opmBindingPath: request_.context.opmBindingPath
                });

                // So for now I am going to throw an Error object.
                // - I want to know if this happens.
                // - I don't think it will happen.
                // - Buy some time to think this through

                if (actResponse.error) {
                    console.error(actResponse.error);
                    throw new Error(actResponse.error);
                }
                return;

            });
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

};

