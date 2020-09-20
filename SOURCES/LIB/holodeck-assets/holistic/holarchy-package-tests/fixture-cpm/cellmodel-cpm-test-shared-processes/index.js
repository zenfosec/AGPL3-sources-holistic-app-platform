// cellmodel-cpp-test-process-with-worker-proxy.js

const holarchy = require("@encapsule/holarchy");

const connectProxyActionRequest = {
    holarchy: {
        CellProcessProxy: {
            connect: {
                proxyPath: "#.proxyTest",
                localCellProcess: {
                    // apmID: "i6htE08TRzaWc9Hq00B3sg", // this is a total lie - nonesuch
                    apmID: "J9RsPcp3RoS1QrZG-04XPg", // proxy back to the host process
                    // instanceName -> default to singleton
                    instanceName: "Secondary Shared Test Process"
                }
            }
        }
    }
};

const messengerModel = require("./cellmodel-messenger");

const cppTestDroidModel = new holarchy.CellModel({
    id: "-_Aig3K1Qvu8iqn6ncr00g",
    name: "Test Droid Model",
    description: "A generic model to help orchestrate test creation and experiment further with interesting CellModel usage patterns.",
    apm: {
        id: "e1eD7WDvTJqZwzu0i_FDGA",
        name: "Test Droid Process",
        description: "Provides a mechanism to pre-program a little droid agent to run tests as a cell inside of CellProcessor instance.",

        ocdDataSpec: {
            ____types: "jsObject",
            construction: {
                ____types: "jsObject",
                ____defaultValue: {},
                instanceName: { ____accept: [ "jsNull", "jsString" ] },
                droidProcessRuntimeBehaviors: {
                    ____types: "jsArray",
                    ____defaultValue: [],
                    runtimeBehaviorDescriptor: {
                        ____types: "jsObject",
                        operatorRequest: { ____accept: [ "jsUndefined", "jsObject" ] },
                        actionRequest: { ____types: [ "jsUndefined", "jsObject", "jsArray" ] }
                    }
                }
            },
            output: {
                ____types: "jsObject",
                ____defaultValue: {},
                droidBehaviorLog: {
                    ____types: "jsArray",
                    ____defaultValue: [],
                    behaviorStepLog: { ____accept: "jsObject" /* TODO */ }
                }
            }
        },

        steps: {
            uninitialized: {
                description: "Default process start step.",
                transitions: [
                    {
                        transitionIf: { holarchy: { cm: { operators: { ocd: { arrayIsEmpty: { path: "#.construction.droidProcessRuntimeBehaviors" } } } } } },
                        nextStep: "waiting_for_behavior_sequence"
                    },
                    {
                        transitionIf: { always: true },
                        nextStep: "run_behavior_sequence"
                    }
                ]
            },
            waiting_for_behavior_sequence: {
                description: "Waiting for someone to write #.construction.droidProcessRuntimeBehaviors namespace with instructions.",
                transitions: [
                    {
                        transitionIf: { not: { holarchy: { cm: { operators: { ocd: { arrayIsEmpty: { path: "#.construction.droidProcessRuntimeBehaviors" } } } } } } },
                        nextStep: "set_new_behavior"
                    }
                ]
            },
            set_new_behavior: {
                description: "Dequeueing new droid behavior...",
                actions: {
                    enter: [
                        { "e1eD7WDvTJqZwzu0i_FDGA_workerAction": { setNewBehavior: {} } }
                    ],
                },
                transitions: [
                    {
                        transitionIf: { always: true },
                        nextStep: "wait_behavior_operator"
                    }
                ]
            },
            wait_behavior_operator: {
                description: "Wait for the condition specified by the currently set droid behavior.",
                transitions: [
                    {
                        transitionIf: { "e1eD7WDvTJqZwzu0i_FDGA_workerOperator": { evaluateBehaviorOperator: {} } },
                        nextStep: "run_behavior_actions",
                    }
                ]
            },
            run_behavior_actions: {
                description: "Running action(s) specified by the currently set droid behavior.",
                actions: {
                    enter: [
                        {  "e1eD7WDvTJqZwzu0i_FDGA_workerAction": { runBehaviorActions: {} } }
                    ]
                },
                transitions: [
                    {
                        transitionIf: { holarchy: { cm: { operators: { ocd: { arrayIsEmpty: { path: "#.construction.droidProcessRuntimeBehaviors" } } } } } },
                        nextStep: "droid_process_finished"
                    },
                    {
                        transitionIf: { always: true },
                        nextStep: "set_new_behavior"
                    }
                ]
            },
            droid_process_finished: {
                description: "The droid process is finished."
            }
        }
    }

});

const cppTestModel1 = new holarchy.CellModel({
    id: "w6WWHevPQOKeGOe6QSL5Iw",
    name: "CPP Test Model 1",
    description: "A model that tests embedding of reusable generic local cell process proxy model in embedded worker role.",
    apm: {
        id: "J9RsPcp3RoS1QrZG-04XPg",
        name: "CPP Test Process 1",
        description: "A process that tests embedding of reusable generic local cell process proxy model in embedded worker role.",
        ocdDataSpec: {
            ____types: "jsObject",
            construction: {
                ____types: "jsObject",
                ____defaultValue: {},
                instanceName: {
                    ____accept: [ "jsNull", "jsString" ],
                    ____defaultValue: null
                }
            },
            proxyTest: { ____types: "jsObject", ____defaultValue: {}, ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell process proxy (CPP) */ } }

        },
        steps: {

            uninitialized: {
                description: "Default cell process step.",
                transitions: [
                    { transitionIf: { always: true }, nextStep: "test_status_operators" }
                ]
            },

            test_status_operators: {
                description: "Test the CPP status operators.",
                transitions: [
                    { transitionIf: { holarchy: { CellProcessProxy: { isConnected: { proxyPath: "#.proxyTest" } } } }, nextStep: "test_status_operators_unexpected_response" },
                    { transitionIf: { holarchy: { CellProcessProxy: { isBroken: { proxyPath: "#.proxyTest" } } } }, nextStep: "test_status_operators_unexpected_response" },
                    { transitionIf: { holarchy: { CellProcessProxy: { isDisconnected: { proxyPath: "#.proxyTest" } } } }, nextStep: "connect_proxy" },
                    { transitionIf: { always: true }, nextStep: "test_status_operators_unexpected_response" }
                ]
            },

            test_status_operators_unexpected_response: {
                description: "If we reach this step then one of the status transition operators didn't work as we expected it to."
            },

            connect_proxy: {
                description: "Attempt to connect the proxy to something completely random.",

                actions: {
                    enter: [ connectProxyActionRequest ]
                },

                transitions: [
                    {
                        transitionIf: { holarchy: { CellProcessProxy: { isBroken: { proxyPath: "#.proxyTest" } } } },
                        nextStep: "test_status_operators_unexpected_response"
                    },
                    {
                        transitionIf: { holarchy: { CellProcessProxy: { isDisconnected: { proxyPath: "#.proxyTest" } } } },
                        nextStep: "test_status_operators_unexpected_response"
                    },
                    {
                        transitionIf: { holarchy: { CellProcessProxy: { isConnected: { proxyPath: "#.proxyTest" } } } },
                        nextStep: "proxy_connected"
                    },
                    {
                        transitionIf: { always: true },
                        nextStep: "test_status_operators_unexpected_response"
                    }
                ]

            },

            proxy_connected: {
                description: "The cell process proxy helper is now connected to a local cell process instance.",
                transitions: [
                    {
                        transitionIf: { always: true },
                        nextStep: "disconnect_proxy"
                    }
                ],

                actions: {
                    exit: [
                        {
                            holarchy: {
                                CellProcessProxy: {
                                    proxy: {
                                        proxyPath: "#.proxyTest",
                                        actionRequest: {
                                            CPPTestProcess1: {
                                                helloWorld: "Hello, other cell process that I have established a proxy connection to! How are are you doing?"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            },

            disconnect_proxy: {
                description: "The proxy is connected. Now disconnect the proxy.",

                actions: {
                    enter: [
                        { holarchy: { CellProcessProxy: { disconnect: { proxyPath: "#.proxyTest" } } } }
                    ]
                },

                transitions: [
                    {
                        transitionIf: { holarchy: { CellProcessProxy: { isBroken: { proxyPath: "#.proxyTest" } } } },
                        nextStep: "test_status_operators_unexpected_response"
                    },
                    {
                        transitionIf: { holarchy: { CellProcessProxy: { isConnected: { proxyPath: "#.proxyTest" } } } },
                        nextStep: "test_status_operators_unexpected_response"
                    },
                    {
                        transitionIf: { holarchy: { CellProcessProxy: { isDisconnected: { proxyPath: "#.proxyTest" } } } },
                        nextStep: "proxy_disconnected"
                    },
                    {
                        transitionIf: { always: true },
                        nextStep: "test_status_operators_unexpected_response"
                    },
                    {
                        transitionIf: { always: true },
                        nextStep: "test_process_complete"
                    }
                ]

            },

            proxy_disconnected: {
                description: "The proxy has been disconnected.",
                transitions: [
                    {
                        transitionIf: { always: true },
                        nextStep: "reconnect_proxy"
                    }
                ]
            },

            reconnect_proxy: {
                description: "The proxy has been disconnected. Now let's reconnect it.",
                actions: {
                    enter: [ connectProxyActionRequest ]
                },
                transitions: [
                    {
                        transitionIf: { always: true },
                        nextStep: "test_process_complete"
                    }
                ]
            },

            test_process_complete: {
                description: "The last step in the test process.",
                transitions: [
                    {
                        transitionIf: {
                            holarchy: {
                                CellProcessProxy: {
                                    proxy: {
                                        proxyPath: "#.proxyTest",
                                        operatorRequest: {
                                            holarchy: { cm: { operators: { cell: { atStep: { path: "#", step: "test_process_complete" } } } } }
                                        }
                                    }
                                }
                            }
                        },
                        nextStep: "whatever"
                    }
                ]

            },

            whatever: {
                description: "Whatever"
            }

        } // APM process model steps

    }, // APM

    actions: [
        {
            id: "0MRiyw8rSnmdcN7uL2WWrQ",
            name: "CPPTestProcess1: Test Action",
            description: "Whatever.",
            actionRequestSpec: {
                ____types: "jsObject",
                CPPTestProcess1: {
                    ____types: "jsObject",
                    helloWorld: { ____accept: "jsString" }
                }
            },
            actionResultSpec: { ____accept: "jsObject" },
            bodyFunction: function(request_) {
                return {
                    error: null,
                    result: {
                        backAtYou: "Hello. Message was received.",
                        yourMessage: request_.actionRequest.CPPTestProcess1.helloWorld
                    }
                };
            }
        }

    ],

    operators: []

});


const cppTestModel2 = new holarchy.CellModel({
    id: "CIyx6qSlSCyeBKMAQbGMPA",
    name: "CPP Test Model 2",
    description: "A model that embeds a proxy. We use this model to ensure that a cell cannot tell if its role is helper (i.e. embedded in another model's ocdDataSpec via an object namesspace APM binding annotaton).",

    apm: {
        id: "houKkWpYTX6hly7r79gD6g",
        name: "CPP Test Model 2",
        description: "A process that tests a cell's ability to use a cell proxy equivalent regardless of it itself is a helper cell (owned by a cell process). Or, a cell process (either owned or shared).",

        ocdDataSpec: {
            ____types: "jsObject",
            construction: {
                ____types: "jsObject",
                ____defaultValue: {},
                instanceName: {
                    ____types: [ "jsNull", "jsString" ],
                    ____defaultValue: null
                }
            },
            proxyTest: { ____types: "jsObject", ____defaultValue: {}, ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /* cell process proxy (CPP) */ } }
        },

        steps: {

            uninitialized: {
                description: "Default process starting step.",
                actions: {
                    exit: [
                        { holarchy: { CellProcessProxy: { connect: { proxyPath: "#.proxyTest", localCellProcess: { apmID:  "Kh2lTQHGT9qG0j1omkJmAg" /* "CPP Test Message Process" */ } } } } }
                    ]
                },
                transitions: [ { transitionIf: { always: true }, nextStep: "finished" } ]
            },

            finished: {
                description: "The process has reached its terminal step."
            }


        }

    },

    subcells: [ messengerModel ]

});

const cppTestModel3 = new holarchy.CellModel({
    id: "QdTHgiTaR6CDG7mdBEfZng",
    name: "CPP Test Model 3",
    description: "Embeds CPP Test Model 2 as a helper cell to test if the CPM memory manager can correctly handle the helper cell's requests when it's functioning as a helper.",
    apm: {
        id: "ZU4XFMxxT4-43mKsAp0dwA",
        name: "CPP Test Process 3",
        description: "Declares that this cell uses and owns a copy of CPP Test Model 2 whose lifespan is tied to this cell's lifespan (whatever role it's functioning in).",
        ocdDataSpec: {
            ____types: "jsObject",

            // Here we splice in a "helper" insance of CPP Test Model 2 that contains a proxy that it tries to connect when its process starts.
            helper1A: {
                ____types: "jsObject",
                ____defaultValue: {},
                ____appdsl: { apm: "houKkWpYTX6hly7r79gD6g" } // cpp test 2 process
            },
            helper1B: {
                ____types: "jsObject",
                ____defaultValue: {},
                helper2A: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    ____appdsl: { apm: "houKkWpYTX6hly7r79gD6g" } // cpp test 2 process
                },
                helper2B: {
                    ____types: "jsObject",
                    ____defaultValue: {},
                    helper3A: {
                        ____types: "jsObject",
                        ____defaultValue: {},
                        ____appdsl: { apm: "houKkWpYTX6hly7r79gD6g" } // cpp test 2 process
                    }
                }
            },
            helper1C: {
                ____types: "jsObject",
                ____defaultValue: {},
                ____appdsl: { apm: "Kh2lTQHGT9qG0j1omkJmAg" } // messenger process
            }

        }
    },
    subcells: [
        cppTestModel2,
        messengerModel
    ]
});


module.exports = new holarchy.CellModel({
    id: "asXXPy1URzacz2swT74u-A",
    name: "CPP Test Models Wrapper",
    description: "A wrapper for CPP Test CellModels.",
    // TODO: Rename to 'usesCellModels' as the CellModels enumerated here do not actuall change anything about this CellModel's definition.
    // Rather, they define the other CellModels that must also be registered with a CellProcessor instance in order for this cell to function
    // correctly at runtime in the CellProcessor instance.
    subcells: [
        messengerModel,
        // cppTestDroidModel,
        cppTestModel1,
        cppTestModel2,
        cppTestModel3
    ]
});



