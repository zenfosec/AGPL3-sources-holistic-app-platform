// PROJECT/PLATFORM/PACKAGES/holarchy-sml-client.js

const arccore = require("@encapsule/arccore");
const holistic = require("../../../BUILD/holistic");
const react = require("react");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "browser" ],
    packageManifestOverrides: {
        description: "Software Model Library (SML) containing HTML5 browser client plug-in filter assets derived from @encapsule/holarchy.",
        keywords: [ "Encapsule", "holistic", "holarchy", "holarchy-sml", "software model", "software library", "SML", "reuse", "re-use", "ObservableProcessController", "ObservableProcessModel", "ObservableControllerData", "TransitionOperator", "ControllerAction" ],
        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "@encapsule/holarchy": holistic.version,
            "@encapsule/holarchy-sml": holistic.version,
            "react": react.version,
            "react-dom": react.version
        }
    },
    packageReadme: {
        overviewDescriptor: {
            markdown: [
		        "**TODO**"
	        ]
        },
        bodySections: [
	        {
		        markdown: [
		            "**TODO**"
		        ]
	        }
	    ]
    }
};
