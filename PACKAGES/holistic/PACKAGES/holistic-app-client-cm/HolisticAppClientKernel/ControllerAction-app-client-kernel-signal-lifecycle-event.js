"use strict";

// ControllerAction-app-client-kernel-signal-lifecycle-event.js
var holarchy = require("@encapsule/holarchy");

var hackLib = require("./lib");

var controllerAction = new holarchy.ControllerAction({
  id: "mmLcuWywTe6lUL9OtMJisg",
  name: "Holistic App Client Kernel: Signal Lifecycle Event",
  description: "Forwards a holistic app client lifecycle signal to the derived client application's daemon proces.",
  actionRequestSpec: {
    ____types: "jsObject",
    holistic: {
      ____types: "jsObject",
      app: {
        ____types: "jsObject",
        client: {
          ____types: "jsObject",
          kernel: {
            ____types: "jsObject",
            _private: {
              ____types: "jsObject",
              signalLifecycleEvent: {
                ____types: "jsObject",
                eventLabel: {
                  ____types: "jsString",
                  ____inValueSet: ["init", "query", "deserialize", "config", "start", "error"]
                }
              }
            }
          }
        }
      }
    }
  },
  actionResultSpec: {
    ____opaque: true
  },
  bodyFunction: function bodyFunction(request_) {
    var response = {
      error: null
    };
    var errors = [];
    var inBreakScope = false;

    while (!inBreakScope) {
      inBreakScope = true;
      var actorName = "[".concat(this.operationID, "::").concat(this.operationName, "]");
      var messageBody = request_.actionRequest.holistic.app.client.kernel._private.signalLifecycleEvent;
      console.log("".concat(actorName, " signaling lifecycle event '").concat(messageBody.eventLabel, "'..."));
      var hackLibResponse = hackLib.getStatus.request(request_.context);

      if (hackLibResponse.error) {
        errors.push(hackLibResponse.error);
        break;
      }

      var hackDescriptor = hackLibResponse.result;
      var kernelCellData = hackDescriptor.cellMemory;
      var actResponse = void 0,
          ocdResponse = void 0;

      switch (messageBody.eventLabel) {
        // ----------------------------------------------------------------
        case "init":
          actResponse = request_.context.act({
            actorName: actorName,
            actorTaskDescription: "Delegating app client kernel init lifecycle event to the derived app client process.",
            actionRequest: {
              CellProcessor: {
                cell: {
                  cellCoordinates: kernelCellData.derivedAppClientProcessCoordinates,
                  delegate: {
                    actionRequest: {
                      holistic: {
                        app: {
                          client: {
                            lifecycle: {
                              init: {}
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (actResponse.error) {
            errors.push(actResponse.error);
            break;
          }

          response.result = actResponse.result.actionResult;
          break;
        // ----------------------------------------------------------------

        case "query":
          actResponse = request_.context.act({
            actorName: actorName,
            actorTaskDescription: "Delegating app client kernel query lifecycle event to the derived app client process.",
            actionRequest: {
              CellProcessor: {
                cell: {
                  cellCoordinates: kernelCellData.derivedAppClientProcessCoordinates,
                  delegate: {
                    actionRequest: {
                      holistic: {
                        app: {
                          client: {
                            lifecycle: {
                              query: {}
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (actResponse.error) {
            errors.push(actResponse.error);
            break;
          }

          response.result = actResponse.result.actionResult;
          break;
        // ----------------------------------------------------------------

        case "deserialize":
          var bootROMElement = document.getElementById(kernelCellData.bootROMElementID);
          var bootDataBase64 = bootROMElement.textContent;
          var bootDataJSON = new Buffer(bootDataBase64, 'base64').toString('utf8');
          var bootROMData = JSON.parse(bootDataJSON);
          bootROMElement.parentNode.removeChild(bootROMElement); // delete the DOM node

          ocdResponse = request_.context.ocdi.writeNamespace({
            apmBindingPath: request_.context.apmBindingPath,
            dataPath: "#.bootROMData"
          }, bootROMData);

          if (ocdResponse.error) {
            errors.push(ocdResponse.error);
            break;
          }

          actResponse = request_.context.act({
            actorName: actorName,
            actorTaskDescription: "Delegating app client kernel query lifecycle event to the derived app client process.",
            actionRequest: {
              CellProcessor: {
                cell: {
                  cellCoordinates: kernelCellData.derivedAppClientProcessCoordinates,
                  delegate: {
                    actionRequest: {
                      holistic: {
                        app: {
                          client: {
                            lifecycle: {
                              deserialize: {
                                bootROMData: bootROMData
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (actResponse.error) {
            errors.push(actResponse.error);
            break;
          }

          response.result = actResponse.result.actionResult;
          break;
        // ----------------------------------------------------------------

        case "config":
          // Query Cell Process Manager ~
          actResponse = request_.context.act({
            actorName: actorName,
            actorTaskDescription: "Querying the holistic app client kernel cell process to obtain information about shared subsystem cell processes.",
            actionRequest: {
              CellProcessor: {
                cell: {
                  cellCoordinates: "#",
                  query: {}
                }
              }
            },
            apmBindingPath: request_.context.apmBindingPath
          });

          if (actResponse.error) {
            errors.push(actResponse.error);
            break;
          }

          var cellProcessQueryResult = actResponse.result.actionResult; // Connect the derived app client process kernel proxy back to us (the app client kernel).

          actResponse = request_.context.act({
            actorName: actorName,
            actorTaskDescription: "Connecting derived app client process proxy helper cell back to the app client kernel process.",
            actionRequest: {
              CellProcessor: {
                cell: {
                  cellCoordinates: kernelCellData.derivedAppClientProcessCoordinates,
                  delegate: {
                    actionRequest: {
                      CellProcessor: {
                        proxy: {
                          proxyCoordinates: "#.kernelProxy",
                          connect: {
                            processCoordinates: cellProcessQueryResult.query.cellProcessID
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (actResponse.error) {
            errors.push(actResponse.error);
            break;
          } // Connect the derived app client process display adapter proxy to the d2r2 display adapter app client kernel-managed service process.


          actResponse = request_.context.act({
            actorName: actorName,
            actorTaskDescription: "Connected derived app client process proxy helper cell to kernel-provided display adapter service process.",
            actionRequest: {
              CellProcessor: {
                cell: {
                  cellCoordinates: kernelCellData.derivedAppClientProcessCoordinates,
                  delegate: {
                    actionRequest: {
                      CellProcessor: {
                        proxy: {
                          proxyCoordinates: "#.displayProxy",
                          connect: {
                            processCoordinates: kernelCellData.serviceProcesses.d2r2DisplayAdapter.result.actionResult.cellProcessID
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (actResponse.error) {
            errors.push(actResponse.error);
            break;
          } // Connect the derived app client process DOM location processor proxy to the DOM location processor app client kernel-managed service process.


          actResponse = request_.context.act({
            actorName: actorName,
            actorTaskDescription: "Connected derived app client process proxy helper cell to kernel-provided DOM location processor service process.",
            actionRequest: {
              CellProcessor: {
                cell: {
                  cellCoordinates: kernelCellData.derivedAppClientProcessCoordinates,
                  delegate: {
                    actionRequest: {
                      CellProcessor: {
                        proxy: {
                          proxyCoordinates: "#.locationProxy",
                          connect: {
                            processCoordinates: kernelCellData.serviceProcesses.domLocationProcessor.result.actionResult.cellProcessID
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (actResponse.error) {
            errors.push(actResponse.error);
            break;
          } // Query the derived app client process via lifecycle action.


          actResponse = request_.context.act({
            actorName: actorName,
            actorTaskDescription: "Delegating app client kernel config lifecycle event to the derived app client process.",
            actionRequest: {
              CellProcessor: {
                cell: {
                  cellCoordinates: kernelCellData.derivedAppClientProcessCoordinates,
                  delegate: {
                    actionRequest: {
                      holistic: {
                        app: {
                          client: {
                            lifecycle: {
                              config: {
                                // TODO appInitialClientRoute (currently opaque so not an error but needed) likely by app client action implementation).
                                appBootROMData: kernelCellData.lifecycleResponses.deserialize.result.actionResult.appBootROMData,
                                appRuntimeServiceProcesses: {
                                  appClientKernelProcessID: cellProcessQueryResult.query.cellProcessID,
                                  d2r2DisplayAdapterProcessID: kernelCellData.serviceProcesses.d2r2DisplayAdapter.result.actionResult.cellProcessID,
                                  domLocationProcessorProcessID: kernelCellData.serviceProcesses.domLocationProcessor.result.actionResult.cellProcessID
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (actResponse.error) {
            errors.push(actResponse.error);
            break;
          }

          response.result = actResponse.result.actionResult;
          break;
        // ----------------------------------------------------------------

        case "start":
          actResponse = request_.context.act({
            actorName: actorName,
            actorTaskDescription: "Delegating app client kernel query lifecycle event to the derived app client process.",
            actionRequest: {
              CellProcessor: {
                cell: {
                  cellCoordinates: kernelCellData.derivedAppClientProcessCoordinates,
                  delegate: {
                    actionRequest: {
                      holistic: {
                        app: {
                          client: {
                            lifecycle: {
                              start: {}
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (actResponse.error) {
            errors.push(actResponse.error);
            break;
          }

          response.result = actResponse.result.actionResult;
          break;
        // ----------------------------------------------------------------

        case "error":
          actResponse = request_.context.act({
            actorName: actorName,
            actorTaskDescription: "Delegating app client kernel query lifecycle event to the derived app client process.",
            actionRequest: {
              CellProcessor: {
                cell: {
                  cellCoordinates: kernelCellData.derivedAppClientProcessCoordinates,
                  delegate: {
                    actionRequest: {
                      holistic: {
                        app: {
                          client: {
                            lifecycle: {
                              error: {}
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (actResponse.error) {
            errors.push(actResponse.error);
            break;
          }

          response.result = actResponse.result.actionResult;
          break;
        // ----------------------------------------------------------------

        default:
          errors.push("INTERNAL ERROR: Unhandled eventLabel value '".concat(messageBody.eventLabel, "'."));
          break;
      }

      break;
    }

    if (errors.length) {
      response.error = errors.join(" ");
    }

    return response;
  }
});

if (!controllerAction.isValid()) {
  throw new Error(controllerAction.toJSON());
}

module.exports = controllerAction;