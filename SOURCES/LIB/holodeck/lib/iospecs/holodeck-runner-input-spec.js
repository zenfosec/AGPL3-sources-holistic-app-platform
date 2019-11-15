
module.exports = {
    ____types: "jsObject",
    id: {
        ____accept: "jsString",
    },
    name: {
        ____accept: "jsString"
    },
    description: {
        ____accept: "jsString"
    },
    logsRootDir: {
        // Fully-qualified local directory where the test runner will create JSON-format log files.
        ____accept: "jsString"
    },
    testHarnessFilters: {
        ____types: "jsArray",
        ____defaultValue: [],
        testHarnessFilter: { ____accept: "jsObject" } // test harness filter instance reference
    },
    testRequestSets: {
        ____types: "jsArray",
        ____defaultValue: [],
        testRequestSet: {
            ____types: "jsArray",
            harnessRequest: {
                ____types: [ "jsUndefined" , "jsObject" ],
                id: { ____accept: "jsString" },
                name: { ____accept: "jsString" },
                description: { ____accept: "jsString" },
                // expectedOutcome: { ____accept: "jsString", ____inValueSet: [ "pass", "fail" ] },
                vectorRequest: { ____accept: [ "jsUndefined", "jsObject" ] }
            }
        }
    }
};
