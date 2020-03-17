// holodeck-intrinsic-config-harness-program.js

const HolodeckHarness = require("../../HolodeckHarness");

const configHarnessProgram = new HolodeckHarness({

    createConfigHarness: {
        id: "FDCaCMlJSLaBGeOlcbODIw",
        name: "Logger",
        description: "Configures logging options for a holodeck subprogram.",

        programRequestSpec: {
            ____types: "jsObject",
            config: {
                ____types: "jsObject",
                logger: {
                    ____types: "jsObject",
                    options: {
                        ____types: "jsObject", // TODO: extend definition as required
                        ____defaultValue: {}
                    },
                    programRequest: {
                        ____accept: [ "jsObject", "jsArray", "jsNull" ],
                        ____defaultValue: null
                    }
                }
            }
        },

        programResultSpec: {
            ____accept: "jsObject"
        },

        harnessBodyFunction: (harnessRequest_) => {
            return { error: "Not implemented." };
        }
    }
});

if (!configHarnessProgram.isValid()) {
    throw new Error(configHarnessProgram.toJSON());
}

module.exports = configHarnessProgram;

