// holodeck-intrinsic-config-harness-vector-set.js

const HolodeckHarness = require("../../HolodeckHarness");

const configHarnessVectorSet = new HolodeckHarness({
    createConfigHarness: {

        id: "acKR_j0ARJq2oy0SyoADpg",
        name: "Vector Set Config Harness",
        description: "Defines a named set of holodeck program request(s) to be evaluated in the order specified.",

        configRequestInputSpec: {
            ____types: "jsObject",
            vectorSet: {
                ____types: "jsObject"
            }
        },

        configResultOutputSpec: {
            ____types: "jsObject"
        },

        harnessBodyFunction: (harnessRequest_) => {

        }


    }
});

//  This is an intrinsic config harness. It has to be valid.
if (!configHarnessVectorSet.isValid()) {
    throw new Error(configHarnessVectorSet.toJSON());
}

module.exports = configHarnessVectorSet;

