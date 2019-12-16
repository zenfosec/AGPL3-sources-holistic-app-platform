// opm-frame-latch-declaration.js

const opmFrameLatchDeclaration = module.exports = {

    id: "z_mTe02hSWmaM1iRO1pBeA",
    name: "Observable Frame Latch",
    description: "Observable frame latch model buffers a value in an OPM-bound namespace for one evaluation frame.",
    opmDataSpec: {
        ____label: "Observable Frame Latch",
        ____types: "jsObject",
        ____defaultValue: {},
        value: {
            ____opaque: true
        },
        clock: {
            ____accept: "jsBoolean",
            ____defaultValue: false
        }
    },
    steps: {
        uninitialized: {
            description: "Default starting process step.",
            transitions: [
                {
                    nextStep: "updated",
                    transitionIf: { always: true }
                }
            ],
            actions: {
                exit: [
                    { holarchy: { sml: { action: { ocd: { setBooleanFlag: { path: "#.clock" } } } } } }
                ]
            }
        },
        updated: {
            description: "The value managed by the frame latch has been written.",
            transitions: [
                {
                    nextStep: "waiting",
                    transitionIf: { always: true }
                }
            ],
            actions: {
                exit: [
                    { holarchy: { sml: { action: { ocd: { clearBooleanFlag: { path: "#.clock" } } } } } }
                ]
            }
        },
        waiting: {
            description: "Frame latch value has not changed since last signalled update.",
            transitions: [
                {
                    nextStep: "updated",
                    transitionIf: { holarchy: { sml: { operator: { isBooleanFlagSet: { path: "#.clock" } } } } }
                }
            ]

        }
    }
};


