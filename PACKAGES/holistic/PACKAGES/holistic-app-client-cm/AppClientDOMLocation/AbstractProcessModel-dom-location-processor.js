"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// AbstractProcessModel-client-hash-route-location-processor.js
var routerEventDescriptorSpec = {
  ____types: "jsObject",
  actor: {
    ____accept: "jsString",
    ____inValueSet: ["server", // href value set by the app server actor (usually a copy of HTTP request URL from the user actor's agent, the browser).
    "user", // User actor set the current href value via browser user agent forward/back navigation. Or, explicit modification of browser location bar input value.
    "app" // Application actor set the current href value by calling a DOM Location Processor controller action.
    ]
  },
  href: {
    ____accept: "jsString"
    /* copy of location.href */

  },
  routerEventNumber: {
    ____accept: "jsNumber"
  }
};
var apmClientHashRouteLocationProcessor = module.exports = {
  id: "-1Ptaq_zTUa8Gfv_3ODtDg",
  name: "Holistic App Client Kernel: DOM Location Processor",
  description: "Hooks and monitors DOM location events and publishes them via an observable frame latch. Also, provids programmatic control over DOM location.",
  ocdDataSpec: {
    ____label: "Client Hash Route Location Processor",
    ____types: "jsObject",
    "private": {
      ____types: "jsObject",
      ____defaultValue: {},
      routerEventCount: {
        ____label: "Router Event Count",
        ____description: "A count of the total number of observed changes of the DOM location object induced by all actors.",
        ____accept: "jsNumber",
        ____defaultValue: 0
      },
      lastOutputEventIndex: {
        ____label: "Last Output Index",
        ____description: "A count of the total number of routerEventDescriptor objects written to the model's output.",
        ____accept: "jsNumber",
        ____defaultValue: 0
      },
      locationHistory: {
        ____label: "Location History Array",
        ____description: "Array written by the sink hashchange event action for every observed change in location.",
        ____types: "jsArray",
        ____defaultValue: [],
        routerEventDescriptor: routerEventDescriptorSpec
      },
      updateObservers: {
        ____label: "Update Observers Flag",
        ____description: "A Boolean flag set by DOM Location Processor actions to indicate to the DOM Location Processor model that it should transition to update step.",
        ____accept: "jsBoolean",
        ____defaultValue: false
      }
    },
    outputs: {
      ____types: "jsObject",
      ____defaultValue: {},
      currentRoute: _objectSpread(_objectSpread({}, routerEventDescriptorSpec), {}, {
        ____types: ["jsNull", "jsObject"],
        ____defaultValue: null
      })
    }
  },
  steps: {
    uninitialized: {
      description: "Default starting process step.",
      transitions: [{
        transitionIf: {
          always: true
        },
        nextStep: "initialize"
      }]
    },
    initialize: {
      description: "Registering hashchange DOM event callback.",
      actions: {
        enter: [{
          holistic: {
            app: {
              client: {
                cm: {
                  actions: {
                    DOMLocationProcessor: {
                      initialize: true
                    }
                  }
                }
              }
            }
          }
        }],
        exit: [{
          holistic: {
            app: {
              client: {
                cm: {
                  actions: {
                    DOMLocationProcessor: {
                      notifyEvent: {
                        hashchange: true
                      }
                    }
                  }
                }
              }
            }
          }
        }]
      },
      transitions: [{
        transitionIf: {
          always: true
        },
        nextStep: "wait"
      }]
    },
    wait: {
      description: "Waiting for DOM hashchange event.",
      transitions: [{
        transitionIf: {
          holarchy: {
            cm: {
              operators: {
                ocd: {
                  isBooleanFlagSet: {
                    path: "#.private.updateObservers"
                  }
                }
              }
            }
          }
        },
        nextStep: "update"
      }]
    },
    update: {
      description: "The observable browser location has been updated. Information about the current location, and who set it is available in this model's output namespace.",
      transitions: [{
        transitionIf: {
          always: true
        },
        nextStep: "wait"
      }],
      actions: {
        exit: [{
          holarchy: {
            cm: {
              actions: {
                ocd: {
                  clearBooleanFlag: {
                    path: "#.private.updateObservers"
                  }
                }
              }
            }
          }
        }]
      }
    }
  }
};