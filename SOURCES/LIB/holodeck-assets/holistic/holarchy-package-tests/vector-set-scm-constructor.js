
module.exports = [

    {
        id: "VcFs1BSZTLCb8nlIwW3Pmg",
        name: "CellModel Constructor #1",
        description: "Default construct holarchy/CellModel ES6 class. Should fail.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    CellModel: {
                        constructorRequest: undefined // explicitly
                    }
                }
            }
        }
    },

    {
        id: "vzmMGynKTy2uu6W8R-1rvQ",
        name: "CellModel Constructor #2",
        description: "Try to construct a minimally configured CellModel with a single TransitionOperator plug-in.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    CellModel: {
                        constructorRequest: {
                            id: "vzmMGynKTy2uu6W8R-1rvQ",
                            name: "CellModel Constructor #2",
                            description: "Try to construct a minimally configured CellModel with a mimimally-defined OPM association.",
                            apm: {
                                id: "cJSBP90NTcu1bJMhCOjbQg",
                                name: "Placeholder APM",
                                description: "A minimally-configured placeholder."
                            }
                        }
                    }
                }
            }
        }
    },

    {
        id: "AE_pEJ7LTdSvohEBZl_Bfw",
        name: "CellModel Constructor #3",
        description: "Try to construct a minimally configured CellModel with a single TransitionOperator plug-in.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    CellModel: {
                        constructorRequest: {
                            id: "AE_pEJ7LTdSvohEBZl_Bfw",
                            name: "CellModel Constructor #3",
                            description: "Try to construct a minimally configured CellModel with a single TransitionOperator plug-in.",
                            operators: [
                                {
                                    id: "o3Q4YKI_SLOus82xE7Gaag",
                                    name: "Placeholder TOP",
                                    description: "A minimally configured placeholder.",
                                    operatorRequestSpec: { ____accept: "jsObject" },
                                    bodyFunction: (request_) => { return { error: null, result: false }; }
                                }
                            ]
                        }
                    }
                }
            }
        }
    },

    {
        id: "E7xo1-qaSuSrsN5-8jgmRg",
        name: "CellModel Constructor #4",
        description: "Try to construct a minimally configured CellModel with a single ControllerAction plug-in.",

        vectorRequest: {
            holistic: {
                holarchy: {
                    CellModel: {
                        constructorRequest: {
                            id: "E7xo1-qaSuSrsN5-8jgmRg",
                            name: "CellModel Constructor #4",
                            description: "Try to construct a minimally configured CellModel with a single ControllerAction plug-in.",
                            actions: [
                                {
                                    id: "SXYrt7-1SOe91wpQLWFutQ",
                                    name: "Fake Test Action",
                                    description: "A fake test action.",
                                    actionRequestSpec: { ____types: "jsObject", whatever: { ____accept: "jsNull" }},
                                    bodyFunction: (request_) => { return { error: null } }
                                }
                            ]
                        }
                    }
                }
            }
        }
    },


    {
        id: "rShJ0riLSiOxLt0OpFJLJA",
        name: "SoftewareCellModel Constructor #5",
        description: "Try to construct a full (but-ultimately fake) CellModel including subcell definitions.",
        vectorRequest: {
            holistic: {
                holarchy: {
                    CellModel: {
                        constructorRequest: {
                            id: "rShJ0riLSiOxLt0OpFJLJA",
                            name: "SoftewareCellModel Constructor #5",
                            description: "Try to construct a full (but-ultimately fake) CellModel including subcell definitions.",
                        }
                    }
                }
            }
        }
    }


];
