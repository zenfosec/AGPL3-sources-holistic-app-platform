// ValueObserverWorker-CellModel-factory-filter.js

const arccore = require("@encapsule/arccore");
const holarchy = require("@encapsule/holarchy");

const ValueObserverCellModel = require("../HolarchyCommon_ValueObserver");

(function() {

    const filterDeclaration  = {
        operationID: "subr4UgeSl27Z-rzp2ryog",
        operationName: "ValueObserverWorker CellModel Factory",
        operationDescription: "A filter that manufactures a ValueObserverWorker CellModel class instance that is specialized to a specific value type.",

        inputFilterSpec: {
            ____label: "ValueObserverWorker CellModel Factory Request",
            ____description: "Descriptor object sent to ValueObserverWorker CellModel factory with instructions about how to specialize the desired CellModel instance.",
            ____types: "jsObject",
            cellID: { ____accept: "jsString" }, // must be a unique IRUT
            apmID: { ____accept: "jsString" }, // must be a unique IRUT
            valueTypeLabel: { ____accept: "jsString" },
            valueTypeDescription: { ____accept: "jsString" },
            valueTypeSpec: {
                ____label: "Value Data Specification",
                ____description: "An @encapsule/arccore.filter specification for the value type to be made observable.",
                ____accept: "jsObject" // This is an @encapsule/arccore.filter specification declaration.
            }
        },

        outputFilterSpec: {
            ____accept: "jsObject" // This is an @encapsule/holarchy CellModel class instance.
        },

        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;

                let innerResponse = arccore.identifier.irut.isIRUT(request_.cellID);
                if (!innerResponse.result) {
                    errors.push(`Invalid cellID value "${request_.cellID}": ${innerResponse.guidance}`);
                    break;
                }

                innerResponse = arccore.identifier.irut.isIRUT(request_.apmID);
                if (!innerResponse.result) {
                    errors.push(`Invalid apmID value "${request_.apmID}": ${innerResponse.guidance}`);
                    break;
                }

                // ValueObserver CellModel is typically used as a helper cell. But, may also be used as either an owned or shared cell process.

                // MAY ONLY BE ACTIVATED AS A CELL PROCESS (owned or shared).

                const valueObserverWorkerCellModelDeclaration = {
                    id: request_.cellID,
                    name: `${request_.valueTypeLabel} ValueObserverWorker Model`,
                    description: `ValueObserverWorker specialization for value type "${request_.valueTypeLabel}".`,
                    apm: {
                        id: request_.apmID,
                        name: `${request_.valueTypeLabel} ValueObserverWorker Process`,
                        description: `ValueObserverWorker specialization for type "${request_.valueTypeLabel}". Value description "${request_.valueTypeDescription}"`,
                        ocdDataSpec: {
                            ____types: "jsObject",
                            ____defaultValue: {},

                            // This is a proxy helper cell that is connected to a specific ObservableValue cell instance.
                            observableValueProxy: {
                                ____types: "jsObject",
                                ____defaultValue: {},
                                ____appdsl: { apm: "CPPU-UPgS8eWiMap3Ixovg" /*Holarchy Cell Process Proxy*/ }
                            },

                            valueObserver: {
                                ____accept: "jsBoolean",
                                ____defaultValue: true
                            }
                        },
                        steps: {
                            "uninitialized": {
                                description: "Default starting step.",
                                transitions: [
                                    { transitionIf: { always: true }, nextStep: "value-observer-worker-initialize" }
                                ]
                            },
                            "value-observer-worker-initialize": {
                                description: "The ValueObserverWorker process is initializing."
                            }
                        }
                    },
                    actions: [
                    ],
                    operators: [
                    ],
                    subcells: [
                        ValueObserverCellModel
                    ]
                };

                const valueObserverWorkerCellModel = new holarchy.CellModel(valueObserverWorkerCellModelDeclaration);

                if (!valueObserverWorkerCellModel.isValid()) {
                    errors.push(valueObserverWorkerCellModel.toJSON());
                    break;
                }

                response.result = valueObserverWorkerCellModel;

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
