// ControllerAction-app-client-display-activate.js

const holarchy = require("@encapsule/holarchy");
const hacdLib = require("./lib");
const React = require("react");
const ReactDOM = require("react-dom");


const controllerAction = new holarchy.ControllerAction({
    id: "KmTQwP8lQ9mi8hB-1pEIEw",
    name: "Holistic App Client Display Adapter: Initialize Display Layout",
    description: "Performs initial programmatic re-render of the display adapter's DIV target using d2r2 <ComponentRouter/> and a copy of the d2r2 renderData that the app server process used to render the static HTML5 content that resides currently in the display adapter's DIV target element.",

    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                client: {
                    ____types: "jsObject",
                    display: {
                        ____types: "jsObject",
                        _private: {
                            ____types: "jsObject",
                            activate: {
                                ____types: "jsObject",
                                displayLayoutRequest: {
                                    ____types: "jsObject",
                                    renderData: {
                                        // The routable portion of this.props bound to a <ComponentRouter/> instance
                                        ____accept: "jsObject"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____accept: "jsString",
        ____defaultValue: "okay"
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const actorName = `[${this.operationID}::${this.operationName}]`;
            const messageBody = request_.actionRequest.holistic.app.client.display._private.activate;
            console.log(`${actorName} attempting to activate the display process via ReactDOM.hydrate.`);

            let hacdLibResponse = hacdLib.getStatus.request(request_.context);
            if (hacdLibResponse.error) {
                errors.push(hacdLibResponse.error);
                break;
            }
            const displayAdapterStatus = hacdLibResponse.result;
            let displayAdapterCellData = displayAdapterStatus.cellMemory;

            if (displayAdapterCellData.__apmiStep !== "display-adapter-wait-initial-layout") {
                errors.push("This action may only be called once the app client display adapter process is in its \"display-adapter-wait-initial-layout\" step.");
                break;
            }

            const thisProps = {
                renderContext: {
                    serverRender: true,
                    ComponentRouter: displayAdapterCellData.config.ComponentRouter,
                    act: request_.context.act,
                    apmBindingPath: request_.context.apmBindingPath // This will be the holistic app client kernel - not a view process.
                },
                renderData: messageBody.displayLayoutRequest.renderData
            };

            // This re-renders the exact context rendered via ReactDOM by the app server process again in the client
            // using markers embedded by React to make it fast. Effectively, this runs the React components through
            // their full lifecycle (whereas they are not mounted ever in the context of the app server process).
            let d2r2Component = React.createElement(displayAdapterCellData.config.ComponentRouter, thisProps);
            ReactDOM.hydrate(d2r2Component, displayAdapterCellData.config.targetDOMElement);

            // Re-render flipping the renderEnvironment flag to "client". Typically, this is used by the rendering d2r2 Component to trigger some sort of loading/spinner transition.
            delete thisProps.renderContext.serverRender;
            d2r2Component = React.createElement(displayAdapterCellData.config.ComponentRouter, thisProps);
            ReactDOM.render(d2r2Component, displayAdapterCellData.config.targetDOMElement);

            displayAdapterCellData.displayUpdateCount += 1;
            const ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: displayAdapterStatus.displayAdapterProcess.apmBindingPath, dataPath: "#.displayUpdateCount" }, displayAdapterCellData.displayUpdateCount);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            console.log(`> d2r2/React display adapter render #${displayAdapterCellData.displayUpdateCount} completed.`);
            console.log("> The derived app client service display process has been activated, and the display surface is now interacive!");

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

if (!controllerAction.isValid()) {
    throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;
