"use strict";

// nodejs-service-runtime.js
// This is the main entry point of the application's Node.js HTTP 1.1 service process.
// Written once by @encapsule/holistic/appgen during initialization of a new derived app workspace.
(function () {
  var path = require("path");

  var process = require("process");

  var appBuild = require("../app-build");

  try {
    console.log("> \"".concat(path.resolve(__filename), "\" module loading..."));

    var nodeServiceSpecializations = require("./nodejs-service-specializations");

    var _require = require("@encapsule/holistic-nodejs-service"),
        HolisticNodeService = _require.HolisticNodeService;

    var nodeServiceInstance = new HolisticNodeService(nodeServiceSpecializations);

    if (!nodeServiceInstance.isValid()) {
      throw new Error(nodeServiceInstance.toJSON());
    }

    nodeServiceInstance.listen(8080); // START LISTENING FOR HTTP REQUESTS....
  } catch (serviceStartException_) {
    console.log("################################################################");
    console.log("################################################################");
    console.log("***** ".concat(appBuild.app.name, " v").concat(appBuild.app.version, "-").concat(appBuild.app.codename, " buildID \"").concat(appBuild.app.buildID, "\" on commit \"").concat(appBuild.app.buildSource, "\""));
    console.log("> APP SERVER INITIALIZATION ERROR. OS PROCESS EXIT w/ERROR:");
    console.log("================================================================");
    console.error(serviceStartException_.stack);
    console.log("################################################################");
    console.log("################################################################"); // ***** KILL THE NODE.JS PROCESS AND SET OS PROCESS EXIT CODE 1.

    console.log("> \"".concat(path.resolve(__filename), "\" Node.js service process start FAILED! OS process exit code 1."));
    process.exit(1);
  }

  console.log("> \"".concat(path.resolve(__filename), "\" The ").concat(appBuild.app.name, " Node.js service is booting and sholud be online shortly."));
  console.log("> \"".concat(path.resolve(__filename), "\" Hit CTRL+C to terminate the Node.js service process..."));
})();