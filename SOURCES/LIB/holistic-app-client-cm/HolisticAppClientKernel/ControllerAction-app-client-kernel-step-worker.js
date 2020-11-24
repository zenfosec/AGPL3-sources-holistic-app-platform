// ControllerAction-app-client-kernel-step-worker.js

const holarchy = require("@encapsule/holarchy");
const hackLib = require("./lib");

// This action is never expected to be called by an external actor.
// It is only ever expected to be dispatched in response to a process
// step transition in the holistic app client kernel cell process.
// In more detail, this "step worker" action is "called" by OPC._evaluate when
// it is transitioning the app client kernel process between steps that declare
// enter/exit actions that OPC has delegated to us across the action request bus.
// Here in this "step worker" action we define the actual runtime semantics of these
// APM-declared process model orchestrations (i.e. concrete runtime interactions,
// internal/externally-visible side-effects etc.)

const controllerAction = new holarchy.ControllerAction({

    id: "4zsKHGrWRPm9fFa-RxsBuw",
    name: "Holistic App Client Kernel: Process Step Worker",
    description: "Performs actions on behalf of the Holistic App Client Kernel process.",

    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                client: {
                    ____types: "jsObject",
                    kernel: {
                        ____types: "jsObject",
                        _private: {
                            ____types: "jsObject",
                            stepWorker: {
                                ____types: "jsObject",
                                action: {
                                    ____accept: "jsString",
                                    ____inValueSet: [
                                        "noop",
                                        "activate-subprocesses",
                                        "activate-display-adapter",
                                    ],
                                    ____defaultValue: "noop"
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
            const messageBody = request_.actionRequest.holistic.app.client.kernel._private.stepWorker;
            console.log(`${actorName} processing "${messageBody.action}" request on behalf of app client kernel process.`);

            let hackLibResponse  = hackLib.getStatus.request(request_.context);
            if (hackLibResponse.error) {
                errors.push(hackLibResponse.error);
                break;
            }
            const hackDescriptor = hackLibResponse.result;
            const kernelCellData = hackDescriptor.cellMemory;
            let actResponse, ocdResponse;

            switch (messageBody.action) {
            case "noop":
                break;
            case "activate-subprocesses":

                // THIS IS WRONG
                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Activating derived AppMetadata process on behalf of the app client process.",
                    actionRequest: {
                        CellProcessor: {
                            util: {
                                writeActionResponseToPath: {
                                    dataPath: "#.serviceProcesses.appMetadata",
                                    actionRequest: {
                                        CellProcessor: {
                                            process: {
                                                processCoordinates: { apmID: "srjZAO8JQ2StYj07u_rgGg" /* "Holistic App Common Kernel: App Metadata Process" */ },
                                                activate: {
                                                    processData: {
                                                        construction: {
                                                            ...kernelCellData.lifecycleResponses.query.result.actionResult.appMetadata
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    apmBindingPath: request_.context.apmBindingPath,  // this will be the holistic app client kernel process
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Activating DOMLocationProcessor process on behalf of the app client kernel process.",
                    actionRequest: {
                        CellProcessor: {
                            util: {
                                writeActionResponseToPath: {
                                    dataPath: "#.serviceProcesses.domLocationProcessor",
                                    actionRequest: {
                                        CellProcessor: {
                                            process: {
                                                activate: {
                                                    processData: {
                                                        derivedAppClientProcessCoordinates: kernelCellData.derivedAppClientProcessCoordinates
                                                    }
                                                },
                                                processCoordinates: { apmID: "OWLoNENjQHOKMTCEeXkq2g" /* "Holistic App Client Kernel: DOM Location Processor" */ }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    apmBindingPath: request_.context.apmBindingPath // this will be the holistic app client kernel process
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Activating d2r2DisplayAdapter process on behalf of the app client kernel process.",
                    actionRequest: {
                        CellProcessor: {
                            util: {
                                writeActionResponseToPath: {
                                    dataPath: "#.serviceProcesses.d2r2DisplayAdapter",
                                    actionRequest: {
                                        CellProcessor: {
                                            process: {
                                                activate: {
                                                    processData: {
                                                        construction: {
                                                            d2r2Components: kernelCellData.lifecycleResponses.query.result.actionResult.d2r2ComponentsArray
                                                        }
                                                    }
                                                },
                                                processCoordinates: { apmID: "IxoJ83u0TXmG7PLUYBvsyg" /* "Holistic Client App Kernel: d2r2/React Client Display Adaptor" */ }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    apmBindingPath: request_.context.apmBindingPath // this will be the holistic app client kernel process
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }
                // TODO: Let's leave this out for now until the basic stuff is working end-to-end and requirements are less abstract.
                // { CellProcessor: { util: { writeActionResponseToPath: { dataPath: "#.serviceProcesses.clientViewProcessor", actionRequest: { CellProcessor: { process: { activate: {}, processCoordinates: { apmID: "Hsu-43zBRgqHItCPWPiBng" /* "Holistic App Client Kernel: Client View Processor" */ } } } } } } } },
                break;

            case "activate-display-adapter":
                actResponse = request_.context.act({
                    actorName,
                    actorTaskDescription: "Sending initial layout request data to the app client display adapter to activate the display adapter process.",
                    actionRequest: {
                        holistic: {
                            app: {
                                client: {
                                    display: {
                                        _private: {
                                            activate: {
                                                displayLayoutRequest: {
                                                    renderData: kernelCellData.bootROMData.initialDisplayData.renderData
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    apmBindingPath: request_.context.apmBindingPath // this will be the holistic app client kernel process
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

                break;

            default:
                errors.push(`Internal error: unhandled action value "${messageBody.action}".`);
                break;
            }
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
