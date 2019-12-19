"use strict";

// ControllerAction-clear-boolean-flag.js
var holarchy = require("@encapsule/holarchy");

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
  actionResultSpec: {
    ____accept: "jsUndefined"
  },
  // no result
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var message = request_.actionRequest.holarchy.sml.actions.ocd.clearBooleanFlag;
      var fqpath = null; // TODO: Move this to a library function and do a better job.

      if (message.path.startsWith("#")) {
        fqpath = "".concat(request_.context.dataPath).concat(message.path.slice(1));
      } else {
        fqpath = message.path;
      }

      var ocdResponse = request_.context.ocdi.writeNamespace(fqpath, false);

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