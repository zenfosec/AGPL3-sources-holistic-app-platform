
module.exports = [

    {
        id: "8UqseWhbQLSnDnKqu6eVpA",
        name: "ControllerAction contructor #1",
        description: "Test ControllerAction class constructor #1 (undefined constructor request)",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ControllerAction: {
                    }
                }
            }
        }
    },

    {
        id: "stn1B2JRSkOkFxuyejzGjQ",
        name: "ControllerAction constructor #2",
        description: "Test ControllerAction class constructor #2 (minimal constructor request)",
        vectorRequest: {
            holistic: {
                holarchy: {
                    ControllerAction: {
                        constructorRequest: {
                            id: "stn1B2JRSkOkFxuyejzGjQ",
                            name: "ControllAction Test #2",
                            description: "A test ControllerAction plug-in filter.",
                            actionRequestSpec: {
                                ____types: "jsObject",
                                test: {
                                    ____types: "jsObject",
                                    action1: {
                                        ____accept: "jsObject"
                                    }
                                }
                            },
                            bodyFunction: function(request_) {
                                return { error: null };
                            }
                        }
                    }
                }
            }
        }
    }

];
