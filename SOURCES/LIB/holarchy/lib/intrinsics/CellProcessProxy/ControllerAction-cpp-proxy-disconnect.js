// SOURCES/LIB/holarchy/lib/intrinsics/CellProcessProxy/ControllerAction-cpp-proxy-disconnect.js

const ControllerAction = require("../../../lib/ControllerAction");

const action = new ControllerAction({
    id: "ySiBEGcaRGWVOZmwBRyhrA",
    name: "Cell Process Proxy: Disconnect Proxy",
    description: "Disconnect a connected cell process proxy from whatever local cell process it is currently connected to.",

    actionRequestSpec: {
        ____types: "jsObject",
        holarchy: {
            ____types: "jsObject",
            CellProcessor: {
                ____types: "jsObject",
                process: {
                    ____types: "jsObject",
                    proxy: {
                        ____types: "jsObject",
                        disconnect: {
                            ____types: "jsObject",
                            // Disconnect this cell process proxy process instance...
                            proxyPath: {
                                ____accept: "jsString",
                                ____defaultValue: "#"
                            }
                            // ... from the local cell process that the proxy is connected to.
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: {
        ____accept: "jsObject" // TODO
    },

    bodyFunction: function(request_) {
        return { error: null };
    }


});

if (!action.isValid()) {
    throw new Error(action.toJSON());
}

module.exports = action;
