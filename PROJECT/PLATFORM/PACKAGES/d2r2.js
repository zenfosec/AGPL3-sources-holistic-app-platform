// PROJECT/PACKAGES/d2r2.js

const arccore = require("@encapsule/arccore");
const holisticBuild = require("../../../BUILD/holistic");
const holisticPlatformManifest = require("../../GENERATOR/holistic-platform-manifest");

module.exports = {
    packageType: "library",
    packageEnvironments: [ "node" ],
    packageManifestOverrides: {
        description: "Data-Driven React Render (d2r2) allows you to map JSON data types to React components and affect layout via JSON document composition dynamically at runtime w/type safety.",
        keywords: [ "Encapsule", "React", "ComponentRouter", "discriminator", "render", "filter", "d2r2", "layout", "template" ],

        license: "MIT",
        main: "index.js",
        peerDependencies: {
            "@encapsule/arccore": arccore.__meta.version,
            "react": holisticPlatformManifest.platformDependencies["react"],
            "react-dom": holisticPlatformManifest.platformDependencies["react-dom"]
        }
    },

    packageReadme: {
        summaryDescriptor: {
            heading: undefined,
            markdown: [
                "Yo...",
                "What is up?"
            ]
        },
        documentationDescriptor: {
            heading: "## Documentation",
            markdown: [
                "Data-Driven React Render (d2r2) library for Node.js and modern browser clients."
            ]
        },
        bodySections: []
    }

};
