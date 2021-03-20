// TransitionOperator-ovh-map-is-available.js

(function() {
    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");
    const { cmLabel, cmDescription } = require("./cell-metadata");
    const actionLabel = "mapIsAvailable";
    const actionName = `${cmLabel}::${actionName}`;
    const operator = new holarchy.TransitionOperator({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel, ACT: actionLabel }).result.ACTID,
        name: actionName,
        description: "Returns Boolean true if the ObservableValueHelperMap cell contains N > 0 ObservableValueHelper cell(s) (aka signals) AND ObservableValueHelper::valueIsAvailable === true for ALL N signals.",
        operatorRequestSpec: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                common: {
                    ____types: "jsObject",
                    operators: {
                        ____types: "jsObject",
                        ObservableValueHelperMap: {
                            ____types: "jsObject",
                            mapIsAvailable: {
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
        bodyFunction: function(request_) {
            return { error: null, result: false }; // TODO
        }
    });
    if (!operator.isValid()) {
        throw new Error(operator.toJSON());
    }
    module.exports = operator;
})();


