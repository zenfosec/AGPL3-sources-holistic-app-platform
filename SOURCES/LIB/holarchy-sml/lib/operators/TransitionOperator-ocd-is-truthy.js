
const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.TransitionOperator({
    id: "kD1PcgqYQlm7fJatNG2ZsA",
    name: "OCD Namespace Is Truthy",
    description: "Returns Boolean true iff the indicated OCD namespace is truthy.",

    operatorRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            sml: {
                ____types: "jsObject",
                operators: {
                    ____types: "jsObject",
                    ocd: {
                        ____types: "jsObject",
                        isNamespaceTruthy: {
                            ____types: "jsObject",
                            path: {
                                ____accept: "jsString"
                            }
                        }
                    }
                }
            }
        }
    },

    bodyFunction: function(request_) {
        var response = { error: null, result: false };
        var errors = [];
        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            const message = request_.actionRequest.holarchy.sml.operators.ocd.isNamespaceTruthy;
            let fqpath = null;
            if (message.path.startsWith("#")) {
                fqpath = `${request_.context.dataPath}${message.path.slice(1)}`;
            } else {
                fqpath = message.path;
            }

            const filterResponse = request_.context.ocdi.readNamespace(fqpath);
            if (filterResponse.error) {
                errors.push(filterRepsonse.error);
                break;
            }

            response.result = (filterResponse.result)?true:false;
            break;
        }
        if (errors.length)
            response.error = errors.join(" ");
        return response;
    }
});
