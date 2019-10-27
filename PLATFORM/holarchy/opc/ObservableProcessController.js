"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var arccore = require("@encapsule/arccore");

var constructorRequestFilter = require("./filters/ObservableProcessController-constructor-filter");

var evaluateFilter = require("./filters/ObservableProcessController-evaluate-filter");

var ControllerDataStore = require("./ControllerDataStore");

var ObservableProcessController =
/*#__PURE__*/
function () {
  function ObservableProcessController(request_) {
    _classCallCheck(this, ObservableProcessController);

    try {
      // #### sourceTag: Gql9wS2STNmuD5vvbQJ3xA
      console.log("ObservableProcessController::constructor starting..."); // Allocate private, per-class-instance state.

      this._private = {}; // ----------------------------------------------------------------
      // Normalize the incoming request descriptor object.

      var filterResponse = constructorRequestFilter.request(request_);

      if (filterResponse.error) {
        throw new Error(filterResponse.error);
      } // ****************************************************************
      // ****************************************************************
      // KEEP A COPY OF THE NORMALIZED OUTPUT OF THE CONSTRUCTION FILTER
      // We no longer care about the request input; internal methods
      // should only access this._private. External access to this values
      // at your own peril as no gaurantee whatsoever across versions
      // is made on _prviate namespace entities.


      this._private = filterResponse.result; // TODO: Evaluate and trim as a later optimization to reduce per-instance memory overhead.
      // ================================================================
      // Build an arccore.discriminator filter instance to route transition
      // operatror request messages to a registered transition operator
      // filter for processing.

      var transitionOperatorFilters = []; // Flatten the array of array of TransitionOperator classes and extract their arccore.filter references.

      request_.transitionOperatorSets.forEach(function (transitionOperatorSet_) {
        transitionOperatorSet_.forEach(function (transitionOperatorInstance_) {
          transitionOperatorFilters.push(transitionOperatorInstance_.getFilter());
        });
      });

      if (transitionOperatorFilters.length >= 2) {
        filterResponse = arccore.discriminator.create({
          options: {
            action: "routeRequest"
          },
          filters: transitionOperatorFilters
        });

        if (filterResponse.error) {
          throw new Error("Unable to construct a discriminator filter instance to route transition operator request messages. ".concat(filterResponse.error));
        }

        this._private.transitionDispatcher = filterResponse.result;
      } else {
        console.log("WARNING: No TransitionOperator class instances have been registered!");
        this._private.transitionDispatcher = {
          request: function request() {
            return {
              error: "No TransitionOperator class instances registered!"
            };
          }
        };
      } // ================================================================
      // Build an arccore.discrimintor filter instance to route controller
      // action request messages to a registitered controller action filter
      // for processing.


      var controllerActionFilters = []; // Flatten the array of array of ControllerAction classes and extract their arccore.filter references.

      request_.controllerActionSets.forEach(function (controllerActionSet_) {
        controllerActionSet_.forEach(function (controllerActionInstance_) {
          controllerActionFilters.push(controllerActionInstance_.getFilter());
        });
      });

      if (controllerActionFilters.length >= 2) {
        filterResponse = arccore.discriminator.create({
          options: {
            action: "routeRequest"
          },
          filters: controllerActionFilters
        });

        if (filterResponse.error) {
          throw new Error("Unable to construct a discriminator filter instance to route controller action request messages. ".concat(filterResponse.error));
        }

        this._private.actionDispatcher = filterResponse.result;
      } else {
        console.log("WARNING: No ControllerAction class instances have been registered!");
        this._private.actionDispatcher = {
          request: function request() {
            return {
              error: "No ControllerAction class instances registered!"
            };
          }
        };
      } // ================================================================
      // Complete initialization of the instance.
      // Construct the contained Observable Controller Data that the OCP instance uses to manage the state associated with OPM instances.


      this._private.controllerData = new ControllerDataStore({
        spec: this._private.ocdSpec,
        data: request_.observableControllerData
      });
      this._private.evalCount = 0; // Keep track of the total number of calls to ObservableProcessController::_evaluate.

      this._private.lastEvaluationResponse = null; // This is overwritten by calls to ObservableProcessController::_evaluate.
      // ----------------------------------------------------------------
      // Bind instance methods.
      // public

      this.toJSON = this.toJSON.bind(this);
      this.act = this.act.bind(this); // private

      this._evaluate = this._evaluate.bind(this); // ----------------------------------------------------------------
      // Wake the beast up...
      // TODO: I am not 100% sure it's the best choice to perform the preliminary evaluation in the constructor.

      filterResponse = this._evaluate();

      if (filterResponse.error) {
        throw new Error(filterResponse.error);
      } // And, we're live.

    } catch (exception_) {
      throw new Error(["ObservableProcessController::constructor failed due to exception.", exception_.name, exception_.message, exception_.stack].join(" "));
    }

    console.log("ObservableProcessController::constructor complete.");
  } // end constructor function
  // ================================================================
  // PUBLIC API METHODS
  // All external interactions with an ObservableProcessController class instance
  // should be via public API methods. Do not dereference the _private data
  // namespace or call underscore-prefixed private class methods.


  _createClass(ObservableProcessController, [{
    key: "toJSON",
    value: function toJSON() {
      return this._private;
    } // toJSON method

  }, {
    key: "act",
    value: function act(request_) {
      request_;
      console.log("ObservableProcessController::act method called!");
      return {
        error: "Not implemented"
      };
    } // act method
    // ================================================================
    // PRIVATE IMPLEMENTATION METHODS
    // By convention underscore-prefixed class methods should never be called
    // outside of the implementation of public and private methods in this class.
    //

  }, {
    key: "_evaluate",
    value: function _evaluate() {
      // #### sourceTag: A7QjQ3FbSBaBmkjk_F8AMw
      // TODO: We can at this point in the execution flow deep copy the CDS,
      // execute the evaluation against the copy. Then depending on the
      // results of the evaluation:
      // * If no error(s), swap out the old CDS instance for the new.
      // * Otherwise, report the evaluation result and leave the contents of the CDS unmodified by the operation.
      console.log("****************************************************************");
      console.log("****************************************************************");
      console.log("ObservableProcessController::_evaluate starting...");
      console.log("================================================================");
      console.log("================================================================"); // Deletegate to the evaluation filter.

      var evalFilterResponse = evaluateFilter.request({
        opcRef: this
      });
      this._private.lastEvaluationResponse = evalFilterResponse;
      this._private.evalCount++;
      console.log("================================================================");
      console.log("================================================================");
      console.log(evalFilterResponse);
      console.log(JSON.stringify(evalFilterResponse, undefined, 2));
      console.log("================================================================");
      console.log("================================================================");
      console.log("ObservableProcessController::_evaluate complete.");
      console.log("****************************************************************");
      console.log("****************************************************************");
      return evalFilterResponse;
    } // _evaluate method

  }]);

  return ObservableProcessController;
}();

module.exports = ObservableProcessController;