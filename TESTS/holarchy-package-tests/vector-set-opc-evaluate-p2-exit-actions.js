
const holarchySML = require("@encapsule/holarchy-sml");
const fixtureOpmExamples = require("./fixture-opm-evaluate-p2-exit-actions");
const fixtureActExamples = require("./fixture-act-evaluate-p2-exit-actions");

module.exports = [

    {
        id: "Gli8ff6FR22PPXjn9epRAQ",
        name: "OPC Evaluate Enter Action Test #1",
        description: "Test controller exit action failure (no controller actions registered).",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "Gli8ff6FR22PPXjn9epRAQ",
                            name: "OPC Evaluate Enter Action Test #1",
                            description: "Test controller exit action failure (no controller actions registered).",
                            ocdTemplateSpec: {
                                ____types: "jsObject",
                                test: {
                                    ____types: "jsObject",
                                    ____defaultValue: {},
                                    ____appdsl: { opm: "Rgt3dz-6Ra-zqpbnpBrJDg" }
                                }
                            },
                            observableProcessModelSets: [
                                fixtureOpmExamples
                            ],
                            transitionOperatorSets: [
                                holarchySML.operators.logical
                            ],
                            controllerActionSets: [
                            ]
                        }
                    }
                }
            }
        }
    },

    {
        id: "5fzWl6WhTEaG7EzC1AgITw",
        name: "OPC Evaluate Enter Action Test #2",
        description: "Test controller action failure (bad request message).",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "5fzWl6WhTEaG7EzC1AgITw",
                            name: "OPC Evaluate Enter Action Test #2",
                            description: "Test controller action failure (bad request message).",
                            ocdTemplateSpec: {
                                ____types: "jsObject",
                                test: {
                                    ____types: "jsObject",
                                    ____defaultValue: {},
                                    ____appdsl: { opm: "Rgt3dz-6Ra-zqpbnpBrJDg" }
                                }
                            },
                            observableProcessModelSets: [
                                fixtureOpmExamples
                            ],
                            transitionOperatorSets: [
                                holarchySML.operators.logical
                            ],
                            controllerActionSets: [
                                fixtureActExamples
                            ]

                        }
                    }
                }
            }
        }
    },

    {
        id: "boPENwtqTDiqX_c6CYfaPw",
        name: "OPC Evaluate Enter Action Test #3",
        description: "Test controller action failure #3 (bad action returns transport error).",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "boPENwtqTDiqX_c6CYfaPw",
                            name: "OPC Evaluate Enter Action Test #2",
                            description: "Test controller action failure (bad request message).",
                            ocdTemplateSpec: {
                                ____types: "jsObject",
                                test: {
                                    ____types: "jsObject",
                                    ____defaultValue: {},
                                    ____appdsl: { opm: "P-uhpNlrTseMNDG3D9ahRA" }
                                }
                            },
                            observableProcessModelSets: [
                                fixtureOpmExamples
                            ],
                            transitionOperatorSets: [
                                holarchySML.operators.logical
                            ],
                            controllerActionSets: [
                                fixtureActExamples
                            ]

                        }
                    }
                }
            }
        }
    },

    {
        id: "pTaZUV0vTOGhaNOVD0sXLQ",
        name: "OPC Evaluate Enter Action Test #4",
        description: "Test controller action failure #4 (bad action throws exception).",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ObservableProcessController: {
                        constructorRequest: {
                            id: "pTaZUV0vTOGhaNOVD0sXLQ",
                            name: "OPC Evaluate Enter Action Test #4",
                            description: "Test controller action failure #4 (bad action throws exception).",
                            ocdTemplateSpec: {
                                ____types: "jsObject",
                                test: {
                                    ____types: "jsObject",
                                    ____defaultValue: {},
                                    ____appdsl: { opm:  "alBMdhnYSbijGj64jxm92g" }
                                }
                            },
                            observableProcessModelSets: [
                                fixtureOpmExamples
                            ],
                            transitionOperatorSets: [
                                holarchySML.operators.logical
                            ],
                            controllerActionSets: [
                                fixtureActExamples
                            ]


                        }
                    }
                }
            }
        }
    }



];
