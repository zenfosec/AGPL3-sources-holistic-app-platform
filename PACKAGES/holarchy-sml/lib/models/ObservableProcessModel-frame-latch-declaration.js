"use strict";

// opm-frame-latch-declaration.js
var opmFrameLatchDeclaration = module.exports = {
  id: "z_mTe02hSWmaM1iRO1pBeA",
  name: "Observable Frame Latch",
  description: "Observable frame latch model buffers a value in an OPM-bound namespace for one evaluation frame.",
  opmDataSpec: {
    ____label: "Observable Frame Latch",
    ____types: "jsObject",
    ____defaultValue: {},

    /*
      This is an interesting subproblem I am not going to solve right now.
      There are controller actions associated with this OPM that reference value.
      The intent is to let whoever binds this OPM to define value. But, we have
      no good way at present to distinguish between precedent. And, the merge
      semantics become considerably less trivial. So for now, I'm just removing
      the definition and will see how bad it is for developers to deal with
      the error that will occur when, for example, the controller actions
      that attempts to write value fails because it's not defined in the OCD
      runtime spec.
             value: {
             ____opaque: true
             },
    */
    clock: {
      ____accept: "jsBoolean",
      ____defaultValue: false
    }
  },
  steps: {
    uninitialized: {
      description: "Default starting process step.",
      transitions: [{
        nextStep: "updated",
        transitionIf: {
          always: true
        }
      }],
      actions: {
        exit: [{
          holarchy: {
            sml: {
              actions: {
                ocd: {
                  setBooleanFlag: {
                    path: "#.clock"
                  }
                }
              }
            }
          }
        }]
      }
    },
    updated: {
      description: "The value managed by the frame latch has been written.",
      transitions: [{
        nextStep: "waiting",
        transitionIf: {
          always: true
        }
      }],
      actions: {
        exit: [{
          holarchy: {
            sml: {
              actions: {
                ocd: {
                  clearBooleanFlag: {
                    path: "#.clock"
                  }
                }
              }
            }
          }
        }]
      }
    },
    waiting: {
      description: "Frame latch value has not changed since last signalled update.",
      transitions: [{
        nextStep: "updated",
        transitionIf: {
          holarchy: {
            sml: {
              operators: {
                ocd: {
                  isBooleanFlagSet: {
                    path: "#.clock"
                  }
                }
              }
            }
          }
        }
      }]
    }
  }
};