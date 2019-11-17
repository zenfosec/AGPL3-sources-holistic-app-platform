
const childProcess = require("child_process");

module.exports = {
    syncExec: function(request_) {
        // request_ = { command: string, cwd: string,  }
        // RETURN RESULT TO CALLER
        const response = childProcess.execSync(request_.command, { cwd: request_.cwd }).toString('utf8').trim();

        // RETURN RESULT TO STDIO/STDERR
        // https://stackoverflow.com/questions/30134236/use-child-process-execsync-but-keep-output-in-console
        // return childProcess.execSync(request_.command, { cwd: request_.cwd, stdio: [0,1,2] });

        // BE VERBOSE
        // console.log(`Subprocess command '${request_.command}' in working directory '${request_.cwd}':`);
        // console.log(response);

        return response;

    }

};

