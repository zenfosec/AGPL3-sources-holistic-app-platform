// holistic-app-client-factory-filter.js

const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");

(function() {

    const filterDeclaration = {
        operationID: "xyEnAFgRRIKHUbjYXfzGyQ",
        operationName: "Holistic App Client CellModel Factory",
        operationDescription: "Constructs a CellModel that encapsulates a custom HTML5 client application derived from core services provided by this and @encapsule/holarchy RTL packages.",

        inputFilterSpec: {
            ____label: "Holistic App Client CellModel Factory Request",
            ____description: "A descriptor object that declares the configuration and defines the runtime details of a class HTML5 client application service derived from @encapsule/holistic-app-client-cm and @encapsule/holarchy RTL package services.",
            ____types: "jsObject",

            name: {
                ____label: "Client Application Name",
                ____description: "The client application name string should be taken (generally) from holistic platform Makefile-generated app-build.json app.name value. Client is implied by context; don't include that in the name.",
                ____accept: "jsString"
            },
            description: {
                ____label: "Client Application Description",
                ____description: "The client application description string should be taken (generally) from holistic platform Makefile-generated app-build.json app.description value. Client is implied by context; don't include that detail in the description.",
                ____accept: "jsString"
            },
            cellModelID: {
                ____label: "Client Application CellModel ID",
                ____description: "A developer-defined IRUT-format string to be used as the CellModel ID for the new CellModel synthesized by this factory filter.",
                ____accept: "jsString"
            },
            apmID: {
                ____label: "Client Application AbstractProcessModel ID",
                ____description: "A developer-defined IRUT-format string to be used as the AbstractProcessModel ID for the APM synthesized by this factory filter.",
                ____accept: "jsString"
            },

            appClientKernelIntegrations: {
                ____label: "Application Client Kernel Integrations",
                ____description: "A descriptor object used to define application-specific behaviors required by the @encapsule/holistic-app-client-cm RTL-provided HolisticAppClientKernel APM.",
                ____types: "jsObject",
                ____defaultValue: {},

                // Note that you provide the bodyFunction's. But, the input and output filter specifications for the synthesized ControllerAction plug-ins inferred here
                // are set and controlled by this factory (as they are closely-coupled to @encapsule/holistic-app-client-cm HolisticAppClientKernel CellModel and its submodels).

                lifecycleSignalActions: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    initFunction: {
                        ____label: "Application Client Lifecyle Signal Action: Initialize",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.init ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] holistic.app.client.lifecycle.initialize signal action default handler.`);
                            return { error: null };
                        }
                    },
                    queryFunction: {
                        ____label: "Application Client Lifecycle Signal Action: Query",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.query ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] holistic.app.client.lifecycle.query signal action default handler.`);
                            return { error: null };
                        }
                    },
                    deserializeFunction: {
                        ____label: "Application Client Lifecycle Signal Action: Deserialize",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.deserialize ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] holistic.app.client.lifecycle.deserialize signal action default handler.`);
                            return { error: null };
                        }
                    },
                    configFunction: {
                        ____label: "Application Client Lifecycle Signal Action: Config",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.config ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] holistic.app.client.lifecycle.configure signal action default handler.`);
                            return { error: null };
                        }
                    },
                    startFunction: {
                        ____label: "Application Client Lifecycle Signal Action: Start",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.start ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] holistic.app.client.lifecycle.start signal action default handler.`);
                            return { error: null };
                        }
                    },
                    errorFunction: {
                        ____label: "Application Client Lifecycle Signal Action: Error",
                        ____description: "A filter bodyFunction that defines client application-specific behaviors for the synthesized CellModel's holistic.app.client.lifecycle.error ControllerAction plug-in.",
                        ____accept: "jsFunction",
                        ____defaultValue: function(request_) {
                            console.log(`[${filterDeclaration.operationID}::${filterDeclaration.operationName}] holistic.app.client.lifecycle.error signal action default handler.`);
                            return { error: null };
                        }
                    }
                }
            },

            appClientCellModels: {
                ____label: "Client Application CellModels",
                ____description: "An array of application-defined CellModel artifacts to be included in the synthesized app client CellModel.",
                ____types: "jsArray",
                ____defaultValue: [],
                cellModel: {
                    ____label: "Client Application CellModel Registration",
                    ____description: "A reference to a client application-specific CellModel to be included in the synthesized app client CellModel.",
                    ____accept: "jsObject"
                }
            }


        },



        outputFilterSpec: {
            ____label: "Holistic App Client CellModel",
            ____description: "Pass this CellModel to CellProcessor constructor function and then activate a cell process with the APM ID you specified to start the HTML5 client application service.",
            ____accept: "jsObject"
        },

        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const appClientCellModel = new holarchy.CellModel({ // CellModel declaration description object.
                    id: request_.cellModelID,
                    name: `${request_.name} App Client CellModel (synthesized)`,
                    description: `Synthesized holistic app client CellModel for derived application '${request_.name}'.`,
                    apm: { // AbstractProcessModel declaration descriptor object
                        id: request_.apmID,
                        name: `${request_.name} AbtractProcessModel (synthesized)`,
                        description: `Synthesized holistic app client AbstractProcessModel for derived application '${request_.name}'.`,
                        ocdDataSpec: {
                            ____label: `${request_.name} Process Memory`,
                            ____description: `ObservableControllerData specification for APM ID '${request_.apmID}'.`,
                            ____types: "jsObject",
                            ____defaultValue: {},
                            // TBD
                        }, // ocdDataSpec
                        /*
                        steps: {
                            uninitialized: {
                                description: "Default APM starting step.",
                                transitions: [ { transitionIf: { always: true }, nextStep: "ready" } ]
                            },
                            ready: {
                                description: "Placeholder terminal step."
                            }
                        }
                        */
                    }, // apm
                    subcells: [ ...request_.appClientCellModels, require("./HolisticAppClientKernel") ],
                    actions: [

                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.start
                        // Call this action from outside CellProcessor in the client.js module to start the derived app client process.
                        // clientAppCellProcessor.act({ actorName: "bootstrap", actorTaskDescription: "start the show...", actionRequest: { holistic: { app: { client: { start: {} } } } } });
                        {
                            id: arccore.identifier.irut.fromReference(`${request_.cellModelID}::holistic.app.client.start`).result,
                            name: "Holistic App Client Lifecycle Action: Initialize",
                            description: "This action is invoked by the Holistic App Client Kernel process to inform the derived app client process to initialize itself.",
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            start: {
                                                ____types: "jsObject" // TODO
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____opaque: true /* TODO */ },
                            bodyFunction: function(controllerActionRequest_) {
                                let response = { error: null };
                                let errors = [];
                                let inBreakScope = false;
                                while (!inBreakScope) {
                                    inBreakScope = true;

                                    const actorName = `${request_.name} App Client Launcher`;

                                    let actResponse = controllerActionRequest_.context.act({
                                        actorName,
                                        actorTaskDescription: `Attempting to launch the Holistic App Client Kernel process on behalf of derived application '${request_.name}'.`,
                                        actionRequest: { CellProcessor: { process: { activate: {}, processCoordinates: { apmID: "PPL45jw5RDWSMNsB97WIWg" /* Holistic App Client Kernel */, instanceName: "daemon" } } } }
                                    });
                                    if (actResponse.error) {
                                        errors.push(actResponse.error);
                                        break;
                                    }

                                    actResponse = controllerActionRequest_.context.act({
                                        actorName,
                                        actorTaskDescription: `Attempting to launch derived application '${request_.name}' process.`,
                                        actionRequest: { CellProcessor: { process: { activate: {}, processCoordinates: { apmID: request_.apmID, instanceName: "daemon" } } } }
                                    });
                                    if (actResponse.error) {
                                        errors.push(actResponse.error);
                                        break;
                                    }

                                    break;
                                }
                                if (errors.length) {
                                    response.error = errors.join(" ");
                                }
                                return response;
                            }
                        },



                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.init
                        {
                            id: arccore.identifier.irut.fromReference(`${request_.cellModelID}::holistic.app.client.lifecycle.init`).result,
                            name: "Holistic App Client Lifecycle Action: Initialize",
                            description: "This action is dispatched by the Holistic App Client Kernel cell process to provide the derived app client cell process with an opportunity to configure/initialize any library and/or runtime code that is _external_ to this CellProcessor instance. ControllerAction bodyFunction should not write CellProcessor memory.",
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                init: {
                                                    ____accept: "jsObject"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____opaque: true /* TODO */ },
                            bodyFunction: request_.appClientKernelIntegrations.lifecycleSignalActions.initFunction
                        },
                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.query
                        {
                            id: arccore.identifier.irut.fromReference(`{request_.cellModelID}::holistic.app.client.lifecycle.query`).result,
                            name: "Holistic App Client Lifecycle Action: Query",
                            description: "This action is dispatched by the Holistic App Client Kernel cell process to query the derived app client process for its requirements and capabilities.",
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                query: {
                                                    ____accept: "jsObject"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____opaque: true /*TODO*/ },
                            bodyFunction: request_.appClientKernelIntegrations.lifecycleSignalActions.queryFunction
                        },
                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.deserialize
                        {
                            id: arccore.identifier.irut.fromReference(`{request_.cellModelID}::holistic.app.client.lifecycle.deserialize`).result,
                            name: "Holistic App Client Lifecycle Action: Deserialize",
                            description: "This action is dispatched by the Holistic App Client Kernel cell process after the HTML5 document has been completely loaded from the holistic app server via HTTP(S) to delegate the processing of derived-client-app-specific \"bootROM\" initialization data (serialized into the HTML5 document by the holistic app server).",
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                deserialize: {
                                                    ____accept: "jsObject"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____opaque: true /*TODO*/ },
                            bodyFunction: request_.appClientKernelIntegrations.lifecycleSignalActions.deserializeFunction
                        },
                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.config
                        {
                            id: arccore.identifier.irut.fromReference(`{request_.cellModelID}::holistic.app.client.lifecycle.config`).result,
                            name: "Holistic App Client Lifecycle Action: Configure",
                            description: "This action is invoked by the Holistic App Client Kernel process to inform the derived app client process that it is time to configure itself.needed to complete the initialization of the kernel process.",
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                config: {
                                                    ____accept: "jsObject"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____opaque: true /*TODO*/ },
                            bodyFunction: request_.appClientKernelIntegrations.lifecycleSignalActions.configFunction
                        },
                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.start
                        {
                            id: arccore.identifier.irut.fromReference(`{request_.cellModelID}::holistic.app.client.lifecycle.start`).result,
                            name: "Holistic App Client Lifecycle Action: Query",
                            description: "This action is invoked by the Holistic App Client Kernel process to query the derived app client process for information needed to complete the initialization of the kernel process.",
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                start: {
                                                    ____accept: "jsObject"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____opaque: true /*TODO*/ },
                            bodyFunction: request_.appClientKernelIntegrations.lifecycleSignalActions.startFunction
                        },
                        // ----------------------------------------------------------------
                        // ControllerAction: holistic.app.client.lifecycle.error
                        {
                            id: arccore.identifier.irut.fromReference(`{request_.cellModelID}::holistic.app.client.lifecycle.error`).result,
                            name: "Holistic App Client Lifecycle Action: Query",
                            description: "This action is invoked by the Holistic App Client Kernel process to query the derived app client process for information needed to complete the initialization of the kernel process.",
                            actionRequestSpec: {
                                ____types: "jsObject",
                                holistic: {
                                    ____types: "jsObject",
                                    app: {
                                        ____types: "jsObject",
                                        client: {
                                            ____types: "jsObject",
                                            lifecycle: {
                                                ____types: "jsObject",
                                                error: {
                                                    ____accept: "jsObject"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            actionResultSpec: { ____opaque: true /*TODO*/ },
                            bodyFunction: request_.appClientKernelIntegrations.lifecycleSignalActions.errorFunction
                        }

                    ]

                });

                if (!appClientCellModel.isValid()) {
                    errors.push(appClientCellModel.toJSON());
                    break;
                }

                response.result = appClientCellModel;


                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }

    };

    const factoryResponse = arccore.filter.create(filterDeclaration);
    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }
    module.exports = factoryResponse.result;

})();
