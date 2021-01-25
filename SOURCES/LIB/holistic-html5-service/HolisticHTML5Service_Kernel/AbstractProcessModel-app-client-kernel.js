// AbstractProcessModel-app-client-kernel-declaration.js

const arccore = require("@encapsule/arccore");
const { AbstractProcessModel } = require("@encapsule/holarchy");

(function() {


    // v0.0.49-spectrolite
    // Should we specialize these for the different uses? There are some nuanced
    // tradeoffs an insufficient time to think them through now. But, we'll need
    // to get all this filter spec composition stuff settled ultimately. There
    // are several approaches worth considering in the long-term.

    const optionalFilterResponseSpec = {
        ____types: [ "jsUndefined", "jsObject" ],
        error: {
            ____accept: [ "jsNull", "jsString" ],
            ____defaultValue: null
        },
        result: {
            ____opaque: true
        }
    };

    // v0.0.49-spectrolite
    // We do need to specialize the kernel's APM so that critical variable information may be schematized for (a) securtiy (b) correctness (b) addressability in OCD storage (c) developer docs

    const factoryResponse = arccore.filter.create({
        operationID: "uspTHejsQq63sCEqouEpYA",
        operationName: "HolisticHTML5Service_Kernel APM Factory",
        operationDecription: "Factory filter leveraged by HolisticHTML5Service_Kernel CellModel Factory (filter) to synthesize a specialized APM for the serivce kernel.",
        inputFilterSpec: {
            ____types: "jsObject",
            appTypes: {
                ____types: "jsObject",
                bootROMSpec: {
                    ____accept: "jsObject" // This is pre-synthesized filter spec for the bootROM data (base64-encoded JSON serialized into HTML5 document by HolisticNodeService instance) serialzed by HolisticNodeService and deserialized by HolisticHTML5Service_Kernel process upon activation/boot.
                }
            }
        },

        outputFilterSpec: {
            ____accept: "jsObject" // This is an @encapsule/holarchy AbstractProcessModel instance specialized for use w/the derived app service logic.
        },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                const serviceKernelAPM = new AbstractProcessModel({

                    id: "PPL45jw5RDWSMNsB97WIWg",
                    name: "HolisticHTML5Service_Kernel Process",
                    description: "This process initializes the CellProcessor environment and manages core processes on behalf of derived app service logic (some number of app-specific cell process(es)) allowing them to function correctly and reliably w/minimal knowledge of how these facilities are actually implemented.",

                    ocdDataSpec: {
                        ____types: "jsObject",
                        ____defaultValue: {},

                        // ----------------------------------------------------------------
                        // BEGIN: required activation data

                        bootROMElementID: { ____types: "jsString", ____defaultValue: "idClientBootROM" },

                        derivedAppClientProcessCoordinates: {
                            ____label: "Derived App Client Runtime Process Coordinates",
                            ____description: "The cell process coordinates to be used to launch the derived app client cell process.",
                            ____types: "jsObject",
                            apmID: { ____accept: "jsString" },
                            instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }
                        },

                        // END: required activation data
                        // ----------------------------------------------------------------

                        serviceProcesses: {
                            ____types: "jsObject",
                            ____defaultValue: {},
                            domLocationProcessor: optionalFilterResponseSpec,
                            d2r2DisplayAdapter: optionalFilterResponseSpec,
                            clientViewProcessor: optionalFilterResponseSpec,
                            appMetadata: optionalFilterResponseSpec,
                        },

                        lifecycleResponses: {
                            ____types: "jsObject",
                            ____defaultValue: {},
                            init: optionalFilterResponseSpec,
                            query: optionalFilterResponseSpec,
                            deserialize: optionalFilterResponseSpec,
                            config: optionalFilterResponseSpec,
                            start: optionalFilterResponseSpec,
                        },

                        windowLoaded: {
                            ____label: "window.onload Completed Flag",
                            ____description: "Boolean flag set when the window.onload event occurs.",
                            ____accept: "jsBoolean",
                            ____defaultValue: false
                        },

                        windowLoadTimeMs: {
                            ____label: "Window Load Time Milliseconds",
                            ____description: "A count of milliseconds reported by the browser in the window.onload event. This is the time from initial URL request to requested HTML5 document + all its referenced resources loaded and available to the app client.",
                            ____accept: "jsNumber",
                            ____defaultValue: -1
                        },

                        displayReady: {
                            ____label: "Display Adapter Ready",
                            ____description: "A flag set by the kernel process to indicate that it is done interacting directly with the display adapter process. And, has passed responsibility for further display update(s) to the derived HTML5 app service.",
                            ____accept: "jsBoolean",
                            ____defaultValue: false
                        },

                        bootROMData: {
                            ...request_.appTypes.bootROMSpec,
                            ____types: [ "jsUndefined" , "jsObject" ] // This is set by the HolisticHTML5Service kernel process during boot once the window.onload even has fired and we know the data can be safely deserialized and validated/normalized.
                        },

                        // v0.0.49-spectrolite confirm the details here. Do we need this. What's this again?
                        // We propogate the error through the app client kernel on the way to the app and take note
                        // in our notification path of our own __apmiStep value if/when that occurs.
                        bootstrapFailureStep: {
                            ____accept: [
                                "jsNull" /*no failure*/,
                                "jsString" /*the __apmiStep value (i.e. our process step) at the point where the bootstrap failed*/
                            ],
                            ____defaultValue: null
                        }

                    },

                    steps: {

                        uninitialized: {
                            description: "Default starting process step.",
                            transitions: [
                                { transitionIf: { always: true }, nextStep: "kernel-boot-start" }
                            ]
                        },

                        "kernel-boot-start": {
                            description: "Holistic app client kernel process services startup.",
                            actions: {
                                exit: [
                                    // These are dispatched while the cell is in process step "kernel-start-services" iff transition === true
                                    { holistic: { app: { client: { kernel: { _private: { hookDOMEvents: {} } } } } } },
                                ]
                            },
                            transitions: [
                                { transitionIf: { always: true }, nextStep: "kernel-signal-lifecycle-init" }
                            ]
                        },

                        // v0.0.50-crystallite --- do we actually need this? If not, remove support. We can add it back later as needed?
                        "kernel-signal-lifecycle-init": {
                            description: "Informing the derived holistic app client process that it is time initialize any private external subsystems that it requires and manages external to this CellProcessor instance.",
                            actions: {
                                exit: [
                                    { CellProcessor: { util: { writeActionResponseToPath: { dataPath: "#.lifecycleResponses.init", actionRequest: { holistic: { app: { client: { kernel: { _private: { signalLifecycleEvent: { eventLabel: "init" } } } } } } } } } } }
                                ]
                            },
                            transitions: [
                                { transitionIf: { always: true }, nextStep: "kernel-signal-lifecycle-query" }
                            ]
                        },

                        // v0.0.50-crystallite --- do we actually need this? If not, remove support. We can add it back later as needed?
                        "kernel-signal-lifecycle-query": {
                            description: "Querying the derived holistic app client process for its runtime requirements and capabilities.",
                            actions: {
                                exit: [
                                    { CellProcessor: { util: { writeActionResponseToPath: { dataPath: "#.lifecycleResponses.query", actionRequest: { holistic: { app: { client: { kernel: { _private: { signalLifecycleEvent: { eventLabel: "query" } } } } } } } } } } }
                                ]
                            },
                            transitions: [
                                { transitionIf: { always: true }, nextStep: "kernel-activate-subprocesses" }
                            ]
                        },

                        "kernel-activate-subprocesses": {
                            description: "Activating cell subprocesses required by the derived app client service.",
                            actions: {
                                enter: [
                                    { holistic: { app: { client: { kernel: { _private: { stepWorker: { action: "activate-subprocesses" } } } } } } }
                                ]
                            },
                            transitions: [
                                { transitionIf: { always: true }, nextStep: "kernel-wait-subprocesses" }
                            ]
                        },

                        "kernel-wait-subprocesses": {
                            description: "Waiting for holistic app client kernel subprocesses to come online...",
                            transitions: [
                                {
                                    transitionIf: {
                                        and: [
                                            { CellProcessor: { cell: { query: { inStep: { apmStep: "display-adapter-wait-initial-layout" } },  cellCoordinates: { apmID: "IxoJ83u0TXmG7PLUYBvsyg" /* "Holistic Client App Kernel: d2r2/React Client Display Adaptor" */ } } } },
                                            { CellProcessor: { cell: { query: { inStep: { apmStep: "dom-location-wait-kernel-config" } }, cellCoordinates: { apmID: "OWLoNENjQHOKMTCEeXkq2g" /* "Holistic App Client Kernel: DOM Location Processor" */ } } } }
                                        ]
                                    },
                                    nextStep: "kernel-wait-browser-tab-resources-loaded"
                                }
                            ]
                        },

                        "kernel-wait-browser-tab-resources-loaded": {
                            description: "Waiting for the browser to finish load/parse of the current HTML5 document so that we can safely presume all the resources that it references are accessible.",
                            transitions: [
                                // TODO: update this action request signature
                                { transitionIf: { holarchy: { cm: { operators: { ocd: { isBooleanFlagSet: { path: "#.windowLoaded" } } } } } },  nextStep: "kernel-deserialize-bootROM" }
                            ]
                        },

                        "kernel-deserialize-bootROM": {
                            description: "The bootROM data serialized to this HTML5 document by HolisticNodeService has been deserialized by HolisticHTML5Service.",
                            actions: {
                                enter: [
                                    { holistic: { app: { client: { kernel: { _private: { stepWorker: { action: "deserialize-bootROM-data" } } } } } } }
                                ]
                            },
                            transitions: [
                                { transitionIf: { always: true }, nextStep: "kernel-complete-subprocess-initializations" }
                            ]
                        },

                        "kernel-complete-subprocess-initializations": {
                            description: "Completing subprocess initializations using information obtained from the deserialized bootROM.",
                            actions: {
                                enter: [
                                    // Rehydrate the display process in whatever state it was left in immediately prior to being serialized to an HTML5 document.
                                    { holistic: { app: { client: { kernel: { _private: { stepWorker: { action: "activate-display-adapter" } } } } } } },

                                    // v0.0.50-crystallite --- do we actually need this? If not, remove support. We can add it back later as needed?

                                    { CellProcessor: { util: { writeActionResponseToPath: { dataPath: "#.lifecycleResponses.deserialize", actionRequest: { holistic:{ app: { client: { kernel: { _private: { signalLifecycleEvent: { eventLabel: "deserialize" } } } } } } } } } } },
                                    { CellProcessor: { util: { writeActionResponseToPath: { dataPath: "#.lifecycleResponses.config", actionRequest: { holistic: { app: { client: { kernel: { _private: { signalLifecycleEvent: { eventLabel: "config" } } } } } } } } } } }
                                ]
                            },
                            transitions: [
                                {
                                    transitionIf: { holarchy: { cm: { operators: { ocd: { compare: { values: { operator: "===", a: { path: "#.bootROMData.initialDisplayData.httpResponseDisposition.code" }, b: { value: 200 } } } } } } } },
                                    nextStep: "kernel-signal-lifecycle-start"
                                },
                                {
                                    transitionIf: { always: true },
                                    nextStep: "kernel-service-offline-standby"
                                }
                            ]
                        },

                        "kernel-signal-lifecycle-start": {
                            description: "Informing the derived holistic app client process that it is time to start the show!",
                            actions: {
                                enter: [
                                    { CellProcessor: { util: { writeActionResponseToPath: { dataPath: "#.lifecycleResponses.start", actionRequest: { holistic: { app: { client: { kernel: { _private: { signalLifecycleEvent: { eventLabel: "start" } } } } } } } } } } }
                                ]
                            },
                            transitions: [
                                { transitionIf: { always: true }, nextStep: "kernel-service-ready" }
                            ]
                        },

                        "kernel-service-ready": {
                            description: "The HolisticHTML5Service kernel process will now stop evaluating in the cell plane and will continue as an active cell servicing runtime requests from the derived app client service process (and its delegates).",
                        },

                        "kernel-service-offline-standby": {
                            description: "The HolisticHTML5Service kernel process is offline due to an error synthesizing a specialized service configuration to execute in this browser tab instance."
                            // For now just sit here and do nothing more on a server error.
                        }

                    } // steps

                }); // new AbstractProcessModel

                if (!serviceKernelAPM.isValid()) {
                    errors.push("Unable to synthesize an AbstractProcessModel for use by this service kernel due to error:");
                    errors.push(serviceKernelAPM.toJSON());
                    break;
                }

                response.result = serviceKernelAPM;

                break;
            }
            if (errors.length) {
                response.error = errors.join(" ");
            }
            return response;
        }
    });

    if (factoryResponse.error) {
        throw new Error(factoryResponse.error);
    }

    module.exports = factoryResponse.result; // a filter that returns the synthesized HolisticHTML5Service_Kernel APM instance

})();

