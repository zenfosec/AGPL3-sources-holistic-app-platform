// ControllerAction-dom-location-processor-configure.js

const holarchy = require("@encapsule/holarchy");

( function() {

    const action = new holarchy.ControllerAction({
        id: "9s71Ju3pTBmYwCe_Mzfkuw",
        name: "HolisticHTML5Service_DOMLocation Configure",
        description: "Used to set the runtime configuration of the process during service boot.",
        actionRequestSpec: {
            ____types: "jsObject",
            holistic: {
                ____types: "jsObject",
                app: {
                    ____types: "jsObject",
                    client: {
                        ____types: "jsObject",
                        domLocation: {
                            ____types: "jsObject",
                            _private: {
                                ____types: "jsObject",
                                configure: {
                                    ____types: "jsObject",
                                    httpResponseCode: { ____accept: "jsNumber" }
                                }
                            }
                        }
                    }
                }
            }
        },
        actionResultSpec: { ____accept: "jsUndefined" },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                const messageBody = request_.actionRequest.holistic.app.client.domLocation._private.configure;
                let ocdResponse = request_.context.ocdi.getNamespaceSpec(request_.context.apmBindingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const apmBindingPathSpec = ocdResponse.result;
                if (!apmBindingPathSpec.____appdsl || !apmBindingPathSpec.____appdsl.apm || (apmBindingPathSpec.____appdsl.apm !==  "OWLoNENjQHOKMTCEeXkq2g")) {
                    errors.push(`Invalid apmBindingPath="${request_.context.apmBindingPath}" does not resolve to an active HolisticHTML5Service_DOMLocation cell as expected.`);
                    break;
                }
                ocdResponse = request_.context.ocdi.writeNamespace({ apmBindingPath: request_.context.apmBindingPath, dataPath: "#.httpResponseCode" }, messageBody.httpResponseCode);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
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

    if (!action.isValid()) {
        throw new Error(action.toJSON());
    }

    module.exports = action;

})();

