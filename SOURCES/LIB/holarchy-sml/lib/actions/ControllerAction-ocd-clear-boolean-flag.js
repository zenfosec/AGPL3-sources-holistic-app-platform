// ControllerAction-clear-boolean-flag.js

const holarchy = require("@encapsule/holarchy");

module.exports = new holarchy.ControllerAction({
    id: "_yxWfFLnTqqN-UxRdd7W5w",
    name: "Clear Boolean Flag",
    description: "Clears a Boolean flag in the OCD.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            sml: {
                ____types: "jsObject",
                actions: {
                    ____types: "jsObject",
                    ocd: {
                        ____types: "jsObject",
                        clearBooleanFlag: {
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
    actionResultSpec: { ____accept: "jsUndefined" }, // no result

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            const message = request_.actionRequest.holarchy.sml.actions.ocd.clearBooleanFlag;
            const rpResponse = holarchy.ObservableControllerData.dataPathResolve({
                opmBindingPath: request_.context.dataPath,
                dataPath: message.path
            });
            if (rpResponse.error) {
                errors.push(rpResponse.error);
                break;
            }
            const ocdResponse = request_.context.ocdi.writeNamespace(rpResponse.result, false);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
            }
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    } // end bodyFunction
});
