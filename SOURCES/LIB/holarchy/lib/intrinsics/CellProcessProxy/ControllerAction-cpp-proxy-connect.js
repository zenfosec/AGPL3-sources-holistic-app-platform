// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessProxy/ControllerAction-cpp-proxy-connect.js

const arccore = require("@encapsule/arccore");
const ControllerAction = require("../../../ControllerAction");
const OCD = require("../../../lib/ObservableControllerData");
const cpmLib = require("../CellProcessManager/lib");
const cppLib = require("./lib");

const action = new ControllerAction({
    id: "X6ck_Bo4RmWTVHl-vk-urw",
    name: "Cell Process Proxy: Connect Proxy",
    description: "Disconnect a connected cell process proxy process (if connected). And, connect the proxy to the specified local cell process.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessProxy: {
                ____types: "jsObject",
                connect: {
                    ____types: "jsObject",
                    apmID: {
                        ____accept: "jsString"
                    },
                    instanceName: {
                        ____accept: "jsString",
                        ____defaultValue: "singleton"
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____accept: "jsObject" // TODO
    },

    bodyFunction: function(request_) {
        let response = { error: null };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            let runGarbageCollector = false;
            const message = request_.actionRequest.holarchy.CellProcessProxy.connect;

            const proxyHelperPath = request_.context.apmBindingPath; // Take request_.context.apmBindingPath to be the path of the cell bound to CellProcessProxy that the caller wishes to connected.

            // This ensures we're addressing an actuall CellProcessProxy-bound cell.
            // And, get us a copy of its memory and its current connection state.
            let cppLibResponse = cppLib.getStatus.request({
                proxyHelperPath,
                ocdi: request_.context.ocdi
            });
            if (cppLibResponse.error) {
                errors.push("Cannot locate the cell process proxy cell instance.");
                errors.push(cppLibResponse.error);
                break;
            }
            const cppMemoryStatusDescriptor = cppLibResponse.result;

            // Okay - we're talking to an active CellProcessProxy helper cell.

            // Get the CPM process' data.
            let cpmLibResponse = cpmLib.getProcessManagerData.request({ ocdi: request_.context.ocdi });
            if (cpmLibResponse.error) {
                errors.push(cpmLibResponse.error);
                break;
            }
            const cpmDataDescriptor = cpmLibResponse.result;

            // CellProcessProxy cells are always owned by another cell...
            // CellProcessProxy CellModel APM ID is not registered with the CPM so you cannot activate a proxy via CPM process create.
            // Which means you cannot connect a proxy to a proxy... At least not directly.

            // So, now because we know we're a helper cell (i.e. declared within and thus "owned") by at least one containing APM layer
            // we need to determine exactly where we are in relationship to the cell below us on this memory branch that is actually
            // an cell process (i.e. its hashed cellPath IRUT is present in the CPM cell process graph).

            cpmLibResponse = cpmLib.getProcessOwnershipReportDescriptor.request({
                cellPath: proxyHelperPath,
                cpmDataDescriptor: cpmDataDescriptor,
                ocdi: request_.context.ocdi
            });
            if (cpmLibResponse.error) {
                errors.push(`An unexpected error occurred while trying to determine which cell process owns CellProcessProxy helper cell at path '${proxyHelperPath}':`);
                errors.push(cpmLibResponse.error);
                break;
            }
            const cellOwnershipReport = cpmLibResponse.result;

            // TEMPORARY: For now, let's keep the current restrictions on proxy depth that we have currently imposed as they are so as not to break anything.
            if (cellOwnershipReport.ownershipVector.length !== 2) {
                errors.push(`Unsupported connection request on CellProcessProxy helper cell at path '${proxyHelperPath}' that is declared at namespace height ${cellOwnershipReport.ownershipVector.length} > 2 relative to its owning cell process. NOTE: I am working to remove this restriction now...`);
                break;
            }

            const proxyOwnerProcessID = cellOwnershipReport.ownershipVector[1].cellID;
            const proxyOwnerProcessPath = cellOwnershipReport.ownershipVector[1].cellPath

            // At this point we know / are confident of the following:
            //
            // - We know which existing owned (i.e. allocated w/CPM process create) OR shared (i.e. allocated w/CPM process open)
            // cell process will OWN (i.e. will hold, by proxy in this example) a reference to another local owned or shared cell process.
            // - We are confident that relative to the owner we can access the specified cell process proxy helper cell. And, that it is actually
            // bound to the CellProcessProxy APM etc.
            //
            // However, we do not yet know anything yet about the local cell process that the caller wishes to connect to via the proxy instance. So, we look at that next.

            const lcpBindingPath = `~.${message.apmID}_CellProcesses.cellProcessMap.${arccore.identifier.irut.fromReference(message.instanceName).result}`;

            let ocdResponse = request_.context.ocdi.getNamespaceSpec(lcpBindingPath);
            if (ocdResponse.error) {
                errors.push(`Unable to connect CellProcessProxy at path '${proxyHelperPath}' to a cell process with APM ID value '${message.apmID}' as specified. This AbstractProcessModel is not known inside this CellProcessor instance.`);
                errors.push(ocdResponse.error);
                break;
            }

            const lcpProcessID = arccore.identifier.irut.fromReference(lcpBindingPath).result;
            const proxyHelperID = cellOwnershipReport.ownershipVector[0].cellID;

            // We now know it's possible to create an instance of the localCellProcess. But, we still do not know if the lcp is already present in
            // either the sharedCellProcesses.digraph and/or the ownedCellProcesses.digraph. And, the logic is a bit tricky. However, at this point
            // we can start to mutate the graphs because we're past the point where any bad input provided via request_ is likely to cause an error.

            if (!cpmDataDescriptor.data.sharedCellProcesses.digraph.isVertex(proxyOwnerProcessID)) {
                // This host is not currently hosting any connected proxy helper instance(s). And, no other host owns proxy instance(s) that are connected to it.
                // And, we know the host must exist. So, it must be an owned cell process. Record it as such.
                cpmDataDescriptor.data.sharedCellProcesses.digraph.addVertex({ u: proxyOwnerProcessID, p: { role: "owned", apmBindingPath: proxyOwnerProcessPath }});
            }

            if (cpmDataDescriptor.data.sharedCellProcesses.digraph.isVertex(proxyHelperID)) {
                // This indicates that this proxy helper instance is currently connected.
                cpmDataDescriptor.data.sharedCellProcesses.digraph.removeVertex(proxyHelperID); // host -> proxy -> lcp (linked) ===> host lcp (unlinked)
                runGarbageCollector = true;
            }

            const proxyOwnerProcessRole = cpmDataDescriptor.data.sharedCellProcesses.digraph.getVertexProperty(proxyOwnerProcessID).role;

            cpmDataDescriptor.data.sharedCellProcesses.digraph.addVertex({ u: proxyHelperID, p: { role: `${proxyOwnerProcessRole}-proxy`, apmBindingPath: proxyHelperPath }});
            cpmDataDescriptor.data.sharedCellProcesses.digraph.addEdge({ e: { u: proxyOwnerProcessID, v: proxyHelperID }, p: { role: "host-to-proxy" }});

            // If LCP is present in the sharedProcessesDigraph and not the ownedProcessesDigraph there's a consistency problem.
            if (cpmDataDescriptor.data.sharedCellProcesses.digraph.isVertex(lcpProcessID)) {
                if (!cpmDataDescriptor.data.ownedCellProcesses.digraph.isVertex(lcpProcessID)) {
                    errors(`Internal consistency error detected. Cannot connect proxy '${proxyHelperPath}' to localCellProcess '${lcpBindingPath}'.`);
                    break;
                }
                const lcpProps = cpmDataDescriptor.data.sharedCellProcesses.digraph.getVertexProperty(lcpProcessID);
                cpmDataDescriptor.data.sharedCellProcesses.digraph.addEdge({ e: { u: proxyHelperID, v: lcpProcessID }, p: { role: `proxy-to-${lcpProps.role}` }});
            } else {
                if (cpmDataDescriptor.data.ownedCellProcesses.digraph.isVertex(lcpProcessID)) {
                    cpmDataDescriptor.data.sharedCellProcesses.digraph.addVertex({ u: lcpProcessID, p: { role: "owned", apmBindingPath: lcpBindingPath }});
                    cpmDataDescriptor.data.sharedCellProcesses.digraph.addEdge({ e: { u: proxyHelperID, v: lcpProcessID }, p: { role: "proxy-to-owned" }});
                } else {
                    const actionResponse = request_.context.act({
                        actorName: "Cell Process Proxy: open connection",
                        actorTaskDescription: "Attempting to create a new owned worker process that will be managed as a shared cell process.",
                        actionRequest: {
                            holarchy: {
                                CellProcessor: {
                                    process: {
                                        create: {
                                            cellProcessCoordinates: {
                                                apmID: message.apmID,
                                                instanceName: message.instanceName
                                            },
                                            cellProcessData: {
                                                construction: {
                                                    instanceName: message.instanceName
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        apmBindingPath: "~" // shared cell processes are owned by the CellProcessor instnace's Cell Process Manager daemon process.
                    });
                    if (actionResponse.error) {
                        errors.push("Failed to create new shared cell process during cell process proxy connect.");
                        errors.push(actionResponse.error);
                    }
                    cpmDataDescriptor.data.sharedCellProcesses.digraph.addVertex({ u: lcpProcessID, p: { role: "shared", apmBindingPath: lcpBindingPath }});
                    cpmDataDescriptor.data.sharedCellProcesses.digraph.addEdge({ e: { u: proxyHelperID, v: lcpProcessID }, p: { role: "proxy-to-shared" }});
                }

            }

            ocdResponse = request_.context.ocdi.writeNamespace(
                proxyHelperPath,
                {
                    "CPPU-UPgS8eWiMap3Ixovg_private": {
                        lcpRequest: {
                            apmID: message.apmID,
                            instanceName: message.instanceName,
                        },
                        lcpConnect: lcpBindingPath
                    }
                }
            );

            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            ocdResponse = request_.context.ocdi.writeNamespace(
                {
                    apmBindingPath: cpmDataDescriptor.path,
                    dataPath: "#.sharedCellProcesses.revision"
                },
                cpmDataDescriptor.data.sharedCellProcesses.revision + 1
            );
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            if (runGarbageCollector) {
                cppLibResponse = cppLib.collectGarbage.request({ act: request_.context.act, cpmData: cpmDataDescriptor.data, ocdi: request_.context.ocdi });
                if (cppLibResponse.error) {
                    errors.push("Oh snap! An error occurred during garbage collection!");
                    errors.push(cppLibResponse.error);
                    break;
                }
            }

            response.result = {
                host: {
                    apmBindingPath: proxyOwnerProcessPath,
                    processID: proxyOwnerProcessID
                },
                proxy: {
                    apmBindingPath: proxyHelperPath,
                    proccessID: proxyHelperID
                },
                connected: {
                    apmBindingPath: lcpBindingPath,
                    processID: lcpProcessID
                }
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
