// nodejs-service-runtime.js
// This is the main entry point of the application's Node.js HTTP 1.1 service process.
// Written once by @encapsule/holistic/appgen during initialization of a new derived app workspace.

(function() {
    const path = require("path");
    const process = require("process");
    const appBuild = require("../app-build");
    const { HolisticNodeService } = require("@encapsule/holistic-nodejs-service");
    try {
        console.log(`> "${path.resolve(__filename)}" module loading...`);
        const appNodeServiceRuntimeSpecializations = require("./nodejs-service-runtime-specializations");
        const appNodeServiceRuntimeInstance = new HolisticNodeService(appNodeServiceRuntimeSpecializations);
        if (!appNodeServiceInstance.isValid()) {
            throw new Error(appNodeServiceInstance.toJSON());
        }
        // START LISTENING FOR HTTP REQUESTS....
        appNodeServiceRuntimeInstance.listen(8080);
    } catch (serviceStartException_) {
        console.log("################################################################");
        console.log("################################################################");
        console.log(`***** ${appBuild.app.name} v${appBuild.app.version}-${appBuild.app.codename} buildID "${appBuild.app.buildID}" on commit "${appBuild.app.buildSource}"`);
        console.log("> APP SERVER INITIALIZATION ERROR. OS PROCESS EXIT w/ERROR:");
        console.log("================================================================");
        console.error(serviceStartException_.stack);
        console.log("################################################################");
        console.log("################################################################");
        // ***** KILL THE NODE.JS PROCESS AND SET OS PROCESS EXIT CODE 1.
        console.log(`> "${path.resolve(__filename)}" Node.js service process start FAILED! OS process exit code 1.`);
        process.exit(1);
    }
    console.log(`> "${path.resolve(__filename)}" The ${appBuild.app.name} Node.js service is booting and sholud be online shortly.`);
    console.log(`> "${path.resolve(__filename)}" Hit CTRL+C to terminate the Node.js service process...`);
})();
