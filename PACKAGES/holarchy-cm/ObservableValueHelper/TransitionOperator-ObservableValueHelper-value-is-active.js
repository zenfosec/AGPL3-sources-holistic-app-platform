"use strict";

// TransitionOperator-ObsevableValueHelper-value-is-active.js
(function () {
  var holarchy = require("@encapsule/holarchy");

  var cmasObservableValueHelper = require("./cmasObservableValueHelper");

  var cmLabel = require("./cell-label");

  var operatorName = "".concat(cmLabel, " Value Is Active");

  var lib = require("./lib");

  var operator = new holarchy.TransitionOperator({
    id: cmasObservableValueHelper.mapLabels({
      TOP: "valueIsActive"
    }).result.TOPID,
    name: operatorName,
    description: "Returns Boolean true if the target ObservableValue cell is active.",
    operatorRequestSpec: {
      ____types: "jsObject",
      holarchy: {
        ____types: "jsObject",
        common: {
          ____types: "jsObject",
          operators: {
            ____types: "jsObject",
            ObservableValueHelper: {
              ____types: "jsObject",
              valueIsActive: {
                ____types: "jsObject"
              }
            }
          }
        }
      }
    },
    bodyFunction: function bodyFunction(operatorRequest_) {
      return {
        error: null,
        result: false
      };
    }
  });

  if (!operator.isValid()) {
    throw new Error(operator.toJSON());
  }

  module.exports = operator;
})();