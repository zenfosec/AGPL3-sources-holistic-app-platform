// ObservableValue_T/ObservableValueBase/TransitionOperator-ObservableValueBase-value-has-updated.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasObservableValueBase = require("./cmasObservableValueBase");
    const cmLabel = require("./cell-label");
    const operatorName = `${cmLabel} Cell Exists`;

    const operator = new holarchy.TransitionOperator({
        id: cmasObservableValueBase.mapLabels({ TOP: operatorName }).result.TOPID,
        name: operatorName,
        description: "Returns Boolean true iff the ObservableValue cell exists in the cellplane at the specified path / coordinates.",
        operatorRequestSpec: {
            ____label: "ObservableValue Cell Exists Request",
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    operators: {
                        ____types: "jsObject",
                        ObservableValue: {
                            ____types: "jsObject",
                            cellExists: {
                                ____types: "jsObject",
                                path: {
                                    ____accept: "jsString",
                                    ____defaultValue: "#"
                                }
                            }
                        }
                    }
                }
            }
        },

        bodyFunction: function(operatorRequest_) {
            // We should land here w/the apmBindingPath pointing at the provider cell process that holds the target ObservableValue cell of interest (path).
            return { error: null, result: false }; // TODO
        }

    });

    if (!operator.isValid()) {
        throw new Error(operator.toJSON());
    }

    module.exports = operator;

})();

