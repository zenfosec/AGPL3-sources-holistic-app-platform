"use strict";

// SOURCES/LIB/holarchy/lib/intrinsics/ControllerAction-cpm-initialize.js
var arccore = require("@encapsule/arccore");

var ControllerAction = require("../../ControllerAction");

var cpmMountingNamespaceName = require("../../filters/cpm-mounting-namespace-name");

var controllerAction = new ControllerAction({
  id: "VNaA0AMsTXawb32xLaNGTA",
  name: "Cell Process Manager: Initialize",
  description: "Performs initialization of Cell Process Manager cell process (the root and parent process of all cell processes executing in a CellProcess runtime host instance).",
  actionRequestSpec: {
    ____types: "jsObject",
    holarchy: {
      ____types: "jsObject",
      CellProcessor: {
        ____types: "jsObject",
        initialize: {
          ____types: "jsObject",
          options: {
            ____accept: ["jsUndefined", "jsObject"]
          }
        }
      }
    }
  },
  // actionRequestSpec
  actionResultSpec: {
    ____accept: "jsUndefined"
  },
  // calling this action returns no result whatsoever
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      console.log("Cell Process Manager process initializing...");
      var message = request_.actionRequest.holarchy.CellProcessor.initialize;
      var cellProcessTreePath = "~.".concat(cpmMountingNamespaceName, ".cellProcessTree");
      var ocdResponse = request_.context.ocdi.readNamespace(cellProcessTreePath);

      if (ocdResponse.error) {
        errors.push(ocdResponse.error);
        break;
      }

      var cellProcessTreeData = ocdResponse.result;
      var graphFactoryResponse = arccore.graph.directed.create(cellProcessTreeData.digraph ? cellProcessTreeData.digraph : {
        name: "Cell Process Tree Digraph Model",
        description: "Tracks parent/child relationships between dynamically created cellular processes executing within a CellProcessor runtime host instance.",
        vlist: [{
          u: arccore.identifier.irut.fromReference("~").result,
          p: {
            apmBindingPath: "~",
            name: "Cell Process Manager"
          }
        }]
      });

      if (graphFactoryResponse.error) {
        errors.push(graphFactoryResponse.error);
        break;
      }

      var cellProcessTreeDigraph = graphFactoryResponse.result;
      cellProcessTreeData.digraph = cellProcessTreeDigraph;
      ocdResponse = request_.context.ocdi.writeNamespace(cellProcessTreePath, cellProcessTreeData);

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
  } // bodyFunction

});

if (!controllerAction.isValid()) {
  throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;