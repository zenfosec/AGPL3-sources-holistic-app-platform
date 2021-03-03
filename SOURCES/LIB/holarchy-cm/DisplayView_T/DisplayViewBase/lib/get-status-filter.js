// DisplayView_T/DisplayViewBase/lib/index.js

(function() {

    const arccore = require("@encapsule/arccore");
    const cmLabel = require("../cell-label");

    const factoryResponse = arccore.filter.create({
        operationID: "C2R38IuiSiuVLkiW1KFW5A",
        operationName: `${cmLabel} Get Status Filter`,
        operationDescription: "Returns cellMemory for an activated DisplayViewBase cell.",
        inputFilterSpec: {
            ____types: "jsObject",
            apmBindingPath: { ____accept: "jsString" },
            ocdi: { ____accept: "jsObject" },
        },
        outputFilterSpec: {
            ____types: "jsObject",
            cellMemory: { ____accept: "jsObject" }
        },
        bodyFunction: function(request_) {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                let ocdResponse = request_.ocdi.getNamespaceSpec(request_.apmBindingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                const cellSpec = ocdResponse.result;

                if (!cellSpec.____appdsl || !cellSpec.____appdsl.apm) {
                    errors.push(`The cell at apmBindingPath "${request_.apmBindingPath}" does not resolve to a cell!`);
                    break;
                }
                ocdResponse = request_.ocdi.readNamespace(request_.apmBindingPath);
                if (ocdResponse.error) {
                    errors.push(ocdResponse.error);
                    break;
                }
                response.result = { cellMemory: ocdResponse.result };
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

    module.exports = factoryResponse.result;

})();
