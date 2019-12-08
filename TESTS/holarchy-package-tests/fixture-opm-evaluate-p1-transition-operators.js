// fixture-opm-evaluate-p1-transition-operators.js

const holarchy = require("@encapsule/holarchy");

module.exports = [

    new holarchy.ObservableProcessModel({
        id: "_vC2O7DGTZ22R5hvxpy0WQ",
        name: "OPM Test A",
        description: "A simple test OPM (force transition operator error - no registered actions/no-plug-in for request).",
        steps: {
            uninitialized: {
                description: "Default starting process step.",
                transitions: [
                    {
                        transitionIf: {
                            noneSuchOperator: true
                        },
                        nextStep: "goal"
                    }
                ]
            },

            goal: {
                description: "Test goal step (never reached)."
            }
        }
    }),


    new holarchy.ObservableProcessModel({
        id: "SyCUD3kpQ8mtYbV5A_4BPA",
        name: "OPM Test B",
        description: "A simple test OPM (force transition operator error - operator returns transport error)",
        steps: {
            uninitialized: {
                description: "Default starting process step.",
                transitions: [
                    {
                        transitionIf: {
                            badTransitionOperatorResponseError: true
                        },
                        nextStep: "goal"
                    }
                ]
            },

            goal: {
                description: "Test goal step (never reached)."
            }
        }
    }),

    new holarchy.ObservableProcessModel({
        id: "Pkr1EErLSiiHQRt8gCaO0Q",
        name: "OPM Test C",
        description: "A simple test OPM (force transition operator error - operator throws an Error)",
        steps: {
            uninitialized: {
                description: "Default starting process step.",
                transitions: [
                    {
                        transitionIf: {
                            badTransitionOperatorThrowError: true
                        },
                        nextStep: "goal"
                    }
                ]
            },

            goal: {
                description: "Test goal step (never reached)."
            }
        }
    }),

    new holarchy.ObservableProcessModel({
        id: "ZFpRfMRETDqavS3EqEuv1Q",
        name: "OPC Test D",
        description: "A simple test OPM",
        steps: {
        }
    })

];



