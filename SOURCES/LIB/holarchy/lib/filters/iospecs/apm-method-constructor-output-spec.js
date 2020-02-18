// apm-method-constructor-filter-output-spec.js

const inputFilterSpec = require("./apm-method-constructor-input-spec");

module.exports = {
    ____label: "Normalized Abstract Process Model Descriptor",
    ____description: "Normalized APM declaration and derived information consumed by the AbstractProcessModel class.",
    ____types: "jsObject",

    declaration: inputFilterSpec,
    digraph: {
        ____label: "Abstract Process Model Digraph",
        ____description: "A reference to a DirectedGraph model of the APM.",
        ____accept: "jsObject"
    }
};


