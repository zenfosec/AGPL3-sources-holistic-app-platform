"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// good const gitDiffCommand_testVectorEvalJSON = "git diff --unified=0 --stat --numstat -p --dirstat=lines --word-diff=plain";
var gitDiffCommand_testVectorEvalJSON = "git diff --word-diff=plain"; // --unified=<dynamic> better

var fs = require("fs");

var arccore = require("@encapsule/arccore");

var helpers = require("./helpers");

var idHolodeckRunner = "XkT3fzhYT0izLU_P2WF54Q";
var idHolodeckRunnerEvalReport = "dosRgxmiR66ongCbJB78ow";
var factoryResponse = arccore.filter.create({
  // Every filter must define some basic metadata.
  operationID: idHolodeckRunner,
  operationName: "Holodeck Test Runner",
  operationDescription: "Holodeck is an extensible test runner, execution framework, and reporting tool based on the chai assertion, arccore.filter, arccore.discriminator, and arccore.graph libraries.",
  // Filter specs delcare API runtime data invariants for the `bodyFunction` request/response I/O.
  inputFilterSpec: require("./iospecs/holodeck-runner-input-spec"),
  outputFilterSpec: require("./iospecs/holodeck-runner-output-spec"),
  bodyFunction: function bodyFunction(request_) {
    // The request_ in-param is guaranteed to be valid per `inputFilterSpec` (or bodyFunction is simply not dispatched by filter).
    var result = {};
    result[idHolodeckRunner] = {
      summary: {
        requests: 0,
        runnerStats: {
          dispatched: [],
          rejected: [],
          errors: []
        },
        runnerEval: {
          neutral: [],
          pass: {
            expected: [],
            actual: []
          },
          fail: {
            expected: [],
            actual: []
          }
        }
      },
      harnessEvalDescriptors: []
    };
    var response = {
      error: null,
      result: result
    };
    var resultPayload = response.result[idHolodeckRunner];
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      console.log("> Initializing test harness dispatcher...");

      var _factoryResponse = arccore.discriminator.create({
        options: {
          action: "getFilter"
        },
        filters: request_.testHarnessFilters
      });

      if (_factoryResponse.error) {
        errors.push(_factoryResponse.error);
        break;
      }

      var harnessDispatcher = _factoryResponse.result;
      console.log("..... Test harness dispatcher initialized.");
      var dispatchCount = 1; // Loop thought the outer set of test sets. And, inner test sets to dispatch each individual test vector through a (hopefully) appropriate holodeck harness filter plug-in.

      console.log("> Dispatching test sets..."); // Outer set of test sets...

      for (var setNumber = 0; setNumber < request_.testRequestSets.length; setNumber++) {
        var testSet = request_.testRequestSets[setNumber]; // Inner set of test vectors...

        for (var testNumber = 0; testNumber < testSet.length; testNumber++) {
          var testRequest = _objectSpread({}, testSet[testNumber], {
            harnessDispatcher: harnessDispatcher,
            harnessRunner: holisticTestRunner,
            logsRootDir: request_.logsRootDir
          }); // Process runner options vector exclusions.


          if (request_.testRunnerOptions.onlyExecuteVectors
          /*null by default or array if true*/
          ) {
              var indexOfCurrentVector = request_.testRunnerOptions.onlyExecuteVectors.indexOf(testRequest.id);

              if (indexOfCurrentVector < 0) {
                console.log("Skipping test vector '" + testRequest.id + "'.");
                continue;
              }
            } // Here we leverage an arccore.discriminator to route the test vector (a message) to an appropriate handler
          // for further processing (because the runner doesn't know how to actually test anything - this is entirely
          // a function of the holodeck handler filter plug-ins registered with the holodeck runner.


          console.log("..... Running test #".concat(resultPayload.summary.requests, " : [").concat(testRequest.id, "::").concat(testRequest.name, "]"));
          var harnessFilter = null;
          var testResponse = harnessDispatcher.request(testRequest); // try to resolve the harness filter from the test request message.

          if (testResponse.error) {
            testResponse.error = "Runner cannot locate a harness filter to process this request type: ".concat(testResponse.error);
            resultPayload.summary.runnerStats.rejected.push(testRequest.id);
          } else {
            harnessFilter = testResponse.result;
            testResponse = harnessFilter.request(testRequest); // dispatch the actual test vector

            resultPayload.summary.runnerStats.dispatched.push(testRequest.id);

            if (testResponse.error) {
              testResponse.error = "The harness filter registered to handle this message type rejected your request with an error: ".concat(testResponse.error);
              resultPayload.summary.runnerStats.errors.push(testRequest.id);
            }
          } // If this was a typical filter designed for use inside an application or a service we would
          // probably do some error checking at this point and fail the request if something went wrong.
          // But, we're writing a test runner and in this case we want the test runner to _never_ fail
          // (except if it's passed blatantly bad configuration). And, always persist the response of
          // attempting to dispatch each test vector to a JSON file that we can compare and analyze with
          // git. Because these evaluation logs are very tightly constrained using filters throughout
          // holodeck runner and harness factory-produced harness filter plug-ins we can gain great
          // insight into the correct or incorrect operation of our implementation code via git diff
          // without having to specifiy and maintain very fine-grained analysis scripts, and large
          // amounts of hand-maintained "expected results" data.


          var testEvalDescriptor = {}; // Delete non-idempotent and not really interesting information from the request sent to the holodeck harness proxy.

          delete testRequest.harnessDispatcher;
          delete testRequest.harnessRunner;
          delete testRequest.logsRootDir;
          testEvalDescriptor[idHolodeckRunnerEvalReport] = {};
          var harnessFilterId = harnessFilter ? harnessFilter.filterDescriptor.operationID : "000000000000000000";
          testEvalDescriptor[idHolodeckRunnerEvalReport][harnessFilterId] = {};
          var boxedResponse = testEvalDescriptor[idHolodeckRunnerEvalReport][harnessFilterId][testRequest.id] = {
            harnessRequest: testRequest,
            harnessResponse: testResponse
          };
          var harnessEvalFilename = helpers.getHarnessEvalFilename(request_.logsRootDir, request_.id, testRequest.id);
          var harnessEvalDiffFilename = helpers.getHarnessEvalDiffFilename(request_.logsRootDir, request_.id, testRequest.id);
          var harnessEvalDiffChangeLinesFilename = helpers.getHarnessEvalDiffChangeLinesFilename(request_.logsRootDir, request_.id, testRequest.id);
          var harnessEvalJSON = "".concat(JSON.stringify(testEvalDescriptor, undefined, 2), "\n"); // WRITE THE MAIN HARNESS EVALUATION JSON LOG FILE UNCONDITIONALLY.

          fs.writeFileSync(harnessEvalFilename, harnessEvalJSON); // Always write the harness evaluation JSON log

          var gitDiffUnified = 8; // experiment - if idempotent, then use course (not granular) default git diff hunk size.

          if (!boxedResponse.harnessResponse.error) {
            if (!boxedResponse.harnessResponse.result.harnessOptions.idempotent) {
              gitDiffUnified = boxedResponse.harnessResponse.result.harnessOptions.gitDiffHunkSize;
            }
          } // See discussion on git diff: https://github.com/git/git/blob/master/Documentation/diff-format.txt


          var diffCommand = "git diff -p --unified=".concat(gitDiffUnified, " --numstat --dirstat=lines --word-diff=plain ").concat(harnessEvalFilename, " > ").concat(harnessEvalDiffFilename); // console.log("$ " + diffCommand);

          var gitDiffResponse = helpers.syncExecKeepConsole({
            command: diffCommand,
            cwd: helpers.getLogEvalDir(request_.logsRootDir, request_.id)
          });
          gitDiffResponse = fs.readFileSync(harnessEvalDiffFilename).toString("utf8");

          if (gitDiffResponse.length) {
            (function () {
              var gitDiffResponseLines = gitDiffResponse.split("\n");
              var gitDiffResponseLinesChanges = [];
              gitDiffResponseLines.forEach(function (line_) {
                if (line_.startsWith("@@") && line_.endsWith("@@")) {
                  gitDiffResponseLinesChanges.push(line_);
                }
              });

              if (gitDiffResponseLinesChanges.length) {
                fs.writeFileSync(harnessEvalDiffChangeLinesFilename, "".concat(gitDiffResponseLinesChanges.join("\n"), "\n"));
              } else {
                helpers.syncExec({
                  command: "rm -f ".concat(harnessEvalDiffChangeLinesFilename),
                  cwd: helpers.getLogEvalDir(request_.logsRootDir, request_.id)
                });
              }
            })();
          } else {
            helpers.syncExec({
              command: "rm -f ".concat(harnessEvalDiffFilename),
              cwd: helpers.getLogEvalDir(request_.logsRootDir, request_.id)
            });
            helpers.syncExec({
              command: "rm -f ".concat(harnessEvalDiffChangeLinesFilename)
            });
          }

          resultPayload.harnessEvalDescriptors.push(testEvalDescriptor);
          resultPayload.summary.requests++;
        } // for testNumber

      } // for setNumber


      resultPayload.summary.runnerStats.dispatched.sort();
      resultPayload.summary.runnerStats.rejected.sort();
      resultPayload.summary.runnerStats.errors.sort();
      break;
    } // while (!inBreakScope)


    if (errors.length) {
      response.error = errors.join(" ");
    } // This is a standard-form filter response object { error: null | string, result: variant }.
    // In this case we have specified an `outputFilterSpec` that provides our caller with invariant
    // guarantees over the output of `response` returned by this `bodyFunction`. This means that
    // if `bodyFunction` produces a response result (i.e. response.error !== null) then filter
    // will possibly invalidate the response (i.e. will set response.error = "error string...")
    // iff response.result violates the constraints declared by `outputFilterSpec`.
    // This is important because the runner output is often serialized to JSON and written to
    // a commited file for comparison and analysis with git.


    return response;
  }
});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

var holisticTestRunner = factoryResponse.result; // ================================================================
// Build the test runner wrapper function (looks like a filter but it's not);

var runnerFascade = _objectSpread({}, holisticTestRunner, {
  request: function request(runnerRequest_) {
    // In this outer wrapper we're concerned only with the runnerRequest_.logsRootDir string
    // that we need to write the test runner filter response to a JSON-format logfile.
    if (!runnerRequest_ || !runnerRequest_.logsRootDir || Object.prototype.toString.call(runnerRequest_.logsRootDir) !== '[object String]') {
      throw new Error("Bad request. Runner wrapper needs you to specify a string value 'logsRootDir' (fully-qualified filesystem directory path).");
    }

    console.log("> Initializing test runner log directory '".concat(runnerRequest_.logsRootDir, "'..."));
    var runnerResponse = holisticTestRunner.request(runnerRequest_);
    console.log("> Finalizing results and writing summary log...");
    var analysis = {};

    if (!runnerResponse.error) {
      console.log("..... runner returned a response.result. Analyzing...");
      var resultPayload = runnerResponse.result[idHolodeckRunner];
      console.log("Runner '".concat(runnerRequest_.id, "' summary:"));
      analysis.totalTestVectors = resultPayload.summary.requests;
      console.log("> total test vectors ......... ".concat(analysis.totalTestVectors));
      analysis.totalDispatchedVectors = resultPayload.summary.runnerStats.dispatched.length;
      console.log("> total dispatched vectors ... ".concat(analysis.totalDispatchedVectors));
      analysis.totalHarnessResults = resultPayload.summary.runnerStats.dispatched.length - resultPayload.summary.runnerStats.errors.length;
      console.log("> total harness results .,.... ".concat(analysis.totalHarnessResults));
      analysis.totalHarnessErrors = resultPayload.summary.runnerStats.errors.length;
      console.log("> total harness errors ...,... ".concat(analysis.totalHarnessErrors));
      analysis.totalRejectedVectors = resultPayload.summary.runnerStats.rejected.length;
      console.log("> total rejected vectors ..... ".concat(analysis.totalRejectedVectors));
    } else {
      console.error("Runner failed with error: ".concat(runnerResponse.error));
      console.log("Holodeck test vector evaluation log files may have been created/modified.");
      console.log("Holodeck runner evaluation summary files have not been generated due to error.");
      return runnerResponse;
    }

    var runnerEvalLogsDir = helpers.getLogEvalDir(runnerRequest_.logsRootDir, runnerRequest_.id);
    var runnerInducedGitDiffsFilename = helpers.getRunnerInducedGitDiffsFilename(runnerRequest_.logsRootDir, runnerRequest_.id);
    var gitDiffTreeResponse = helpers.syncExec({
      command: "git diff --unified=0 ".concat(runnerEvalLogsDir, " > ").concat(runnerInducedGitDiffsFilename),
      cwd: runnerEvalLogsDir
    });
    fs.writeFileSync(helpers.getRunnerEvalSummaryFilename(runnerRequest_.logsRootDir, runnerRequest_.id), "".concat(JSON.stringify(analysis, undefined, 2), "\n"));
    fs.writeFileSync(helpers.getRunnerResponseFilename(runnerRequest_.logsRootDir, runnerRequest_.id), "".concat(JSON.stringify(runnerResponse, undefined, 2), "\n"));
    return runnerResponse;
  }
});

module.exports = runnerFascade;