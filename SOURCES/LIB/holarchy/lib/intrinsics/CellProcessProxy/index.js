// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessProxy/index.js

const CellModel = require("../../../CellModel");

const cellModel = new CellModel({
    id: "LG9CCSEmSYaU6Mp9J0wZ5g",
    name: "Holarchy Cell Process Proxy Helper Model",
    description: "Defines a helper model that functions as a proxy for action and operator calls to some (any) shared cell process.",
    description: "",


    apm: {
        id: "CPPU-UPgS8eWiMap3Ixovg",
        name: "Holarchy Cell Process Proxy Helper Process",
        description: "Defines a helper process that functions as a proxy for action and operator calls to some (any) shared cell process.",

        ocdDataSpec: {
            ____types: "jsObject",
            "CPPU-UPgS8eWiMap3Ixovg_CellProcessProxy": {
                ____types: "jsObject",
                ____defaultValue: {},
                lcpRequest: {
                    ____types: [ "jsUndefined",
                                 "jsObject"
                               ],
                    apmID: { ____accept: "jsString" },
                    instanceName: { ____accept: "jsString" }
                },
                lcpConnect: {
                    ____accept: [
                        "jsUndefined", // the cell process proxy is disconnected currently
                        "jsString", // the apmBindingPath of the connected local cell process (lcp)
                        "jsNull" // the previous connection has been disconnected due to deletion of owned lcp
                    ]
                }
            }
        }, // ocdDataSpec

        steps: {
            uninitialized: {
                description: "Default cell process step.",
                transitions: [
                    { transitionIf: { always: true }, nextStep: "ready" }
                ]
            },
            ready: {
                description: "The cell process proxy helper process is constructed and ready to accept action and operator requests."
            }
        }

    }, // apm

    actions: [
        require("./ControllerAction-cpp-proxy-action"),
        require("./ControllerAction-cpp-proxy-connect"),
        require("./ControllerAction-cpp-proxy-disconnect")
    ],

    operators: [
        require("./TransitionOperator-cpp-proxy-operator")
    ],

    subcells: []

});

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;


