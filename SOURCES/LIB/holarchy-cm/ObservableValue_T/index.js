// ObservableValue_T/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../cmasHolarchyCMPackage");

    const cmObservableValueBase = require("./ObservableValueBase");
    const cmObservableValueHelper = require("../ObservableValueHelper");
    const cmtObservableValueWorker = require("./ObservableValueWorker_T");

    const templateLabel = "ObservableValue";

    const cmtObservableValue = new holarchy.CellModelTemplate({
        cmasScope: cmasHolarchyCMPackage,
        templateLabel,
        cellModelGenerator: {
            synthesizeMethodRequestSpec: {
                ____label: `${templateLabel}<X> Specialization Request`,
                ____types: "jsObject",
                valueTypeDescription: { ____accept: "jsString" },
                valueTypeSpec: {
                    ____label: "Value Data Specification",
                    ____description: "An @encapsule/arccore.filter specification for the value type to be made observable.",
                    ____accept: "jsObject" // This is an @encapsule/arccore.filter specification declaration.
                }
            },
            generatorFilterBodyFunction: function(request_) {
                let response = { error: null };
                let errors = [];
                let inBreakScope = false;
                while (!inBreakScope) {
                    inBreakScope = true;

                    // First, synthesize a specialized ObservableValueWorker CellModel specialization.
                    let synthesizeResponse = cmtObservableValueWorker.synthesizeCellModel(request_); // Same request signature w/different CellModel generator.
                    if (synthesizeResponse.error) {
                        errors.push(synthesizeResponse.error);
                        break;
                    }

                    const cmObservableValueWorker = synthesizeResponse.result;

                    // Now synthesize the requested ObservableValue specialization.

                    const cellMemorySpec = {
                        ____types: "jsObject",
                        ____defaultValue: {},
                        value: { ...request_.synthesizeRequest.valueTypeSpec },
                        revision: { ____types: "jsNumber", ____defaultValue: -1 },
                    };

                    response.result = {

                        id: request_.cmtInstance.mapLabels({ CM: request_.cellModelLabel }).result.CMID,
                        name: `${templateLabel}<${request_.cellModelLabel}>`,
                        description: `CellModelTemplate<${templateLabel}> specialization for CellModel label "${request_.cellModelLabel}".`,

                        apm: {

                            id: request_.cmtInstance.mapLabels({ APM: request_.cellModelLabel }).result.APMID,
                            name: `${templateLabel}<${request_.cellModelLabel}>`,
                            description: `CellModelTemplate<${templateLabel}> specialization for CellModel label "${request_.cellModelLabel}".`,

                            ocdDataSpec: cellMemorySpec,

                            steps: {

                                "uninitialized": {
                                    description: "Default starting process step.",
                                    transitions: [
                                        {
                                            // If the cell was activated with its memory initialized, skip to observable-value-ready process step.
                                            transitionIf: { holarchy: { cm: { operators: { ocd: { compare: { values: { a: { path: "#.revision" } , operator: ">", b: { value: -1 } } } } } } } },
                                            nextStep: "observable-value-ready"
                                        },
                                        {
                                            transitionIf: { always: true },
                                            nextStep: "observable-value-reset"
                                        }
                                    ]
                                },

                                "observable-value-reset": {
                                    description: "ObservableValue has not yet been written and is in reset process step."
                                },

                                "observable-value-ready": {
                                    description: "ObservableValue has been written and can be read and/or observed for subsequent update(s) by a value producing cell process."
                                }

                            } // ~.apm.steps

                        }, // ~.apm

                        subcells: [
                            cmObservableValueBase, // Generic behaviors of ObservableValue_T
                            cmObservableValueWorker, // Type-specialized ObservableValueWorker_T-generated CellModel used to observe the ObservableValue family CellModel we're generating via a cell process proxy.
                            cmObservableValueHelper, // Generic helper for reading a value from any ObservableValue family member (an active cell whose definition was synthesized here).
                        ]

                    }; // result (CellModel declaration)

                    break;
                }

                if (errors.length) {
                    response.error = errors.join(" ");
                }
                return response;

           } // ~.cellModelGenerator.generatorFilterBodyFunction

       } // ~.cellModelGenerator

    });

    if (!cmtObservableValue.isValid()) {
        throw new Error(cmtObservableValue.toJSON());
    }

    module.exports = cmtObservableValue;

})();

