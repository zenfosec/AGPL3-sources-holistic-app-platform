// cpm-resolve-cell-process-coordinates.js

const arccore = require("@encapsule/arccore");

(function() {

    const resultCache = {};

    const factoryResponse = arccore.filter.create({
        operationID: "6qK5QrJ4Tu2kWi3HOLlbKw",
        operationName: "cpmLib: Resolve Cell Process Coordinates",
        operationDescription: "Converts an APM ID / instance name string pair cell process coordinates to equivalent representations: cellPath, and cellID (an IRUT hash of cellPath).",
        inputFilterSpec: {
            ____types: "jsObject",
            cellProcessCoordinates: {
                ____types: "jsObject",
                apmID: { ____accept: "jsString" },
                instanceName: { ____accept: "jsString", ____defaultValue: "singleton" }
            },
            ocdi: { ____accept: "jsObject" }
        },
        outputFilterSpec: {
            ____types: "jsObject",
            cellProcessCoordinates: {
                ____types: "jsObject",
                apmID: { ____accept: "jsString" },
                instanceName: { ____accept: "jsString" }
            },
            cellProcessesPath: { ____accept: "jsString" },
            cellProcessPath: { ____accept: "jsString" },
            cellProcessID: { ____accept: "jsString" }
        },
        bodyFunction: (request_) => {
            let response = { error: null };
            let errors = [];
            let inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;


                if (!resultCache[request_.cellProcessCoordinates.apmID]) {

                    const cellProcessesPath = `~.${request_.cellProcessCoordinates.apmID}_CellProcesses`;
                    let ocdResponse = request_.ocdi.getNamespaceSpec(cellProcessesPath);
                    if (ocdResponse.error) {
                        errors.push(`Cell process coordinates cannot be resolved to CPM process path/ID because the APM specified, ID '${request_.cellCoordinates.apmID}', is not known inside this CellProcessor instance. Error detail:`);
                        errors.push(ocdResponse.error);
                        break;
                    }
                    resultCache[request_.cellProcessCoordinates.apmID] = { cellProcessesPath, instances: {} };

                } // if APM ID cache miss

                if (!resultCache[request_.cellProcessCoordinates.apmID].instances[request_.cellProcessCoordinates.instanceName]) {

                    const cellProcessesPath = resultCache[request_.cellProcessCoordinates.apmID].cellProcessesPath;

                    const cellProcessInstanceIdentifier = arccore.identifier.irut.fromReference(request_.cellProcessCoordinates.instanceName).result;
                    const cellProcessPath = `${cellProcessesPath}.cellProcessMap.${cellProcessInstanceIdentifier}`;
                    const cellProcessID = arccore.identifier.irut.fromReference(cellProcessPath).result;
                    resultCache[request_.cellProcessCoordinates.apmID].instances[request_.cellProcessCoordinates.instanceName] = {
                        cellProcessCoordinates: request_.cellProcessCoordinates,
                        cellProcessesPath,
                        cellProcessPath,
                        cellProcessID
                    };
                } // if instanceName cache miss

                // Return the cached result.
                response.result = resultCache[request_.cellProcessCoordinates.apmID].instances[request_.cellProcessCoordinates.instanceName];

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
