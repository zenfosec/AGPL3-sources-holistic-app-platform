// @encapsule/holistic-app-client/index.js

const packageMeta = require("./package.json");
const holarchy = require("@encapsule/holarchy");

module.exports = {
    __meta: {
        author: packageMeta.author,
        name: packageMeta.name,
        version: packageMeta.version,
        codename: packageMeta.codename,
        build: packageMeta.buildID,
        source: packageMeta.buildSource
    },

    cml: new holarchy.CellModel({
        id: "JatYSE8JQj6GxT8AOsbssQ",
        name: "Holistic App Client Kernel",
        description: "Provides core HTML5 client application runtime kernel services as an extensible celluar process.",
        subcells: [
            require("./AppClientRuntime"), // manages the overall lifespan of the HTML5 client application.
            require("./AppClientDOMLocation"), // manages the application's interface between the DOM href and hashrouter locations and the state of the cellular runtime process.
            require("./AppClientView"), // provides high-level orchestration for lifespan of application-specific subview processes (a concept we haven't discussed yet).
            require("./AppClientDisplayAdapter"), // encapsules low level details of rendering HTML5 view via @encapsule/d2r2 and Facebook React on behalf of AppClientView.
        ]
    })

};

