// ObservableValueWorker_T/index.js

(function() {

    const holarchy = require("@encapsule/holarchy");
    const cmasHolarchyCMPackage = require("../../cmasHolarchyCMPackage");

    const cmLabel = require("./cellmodel-label");


    const cellModel = new holarchy.CellModel({
        id: cmasHolarchyCMPackage.mapLabels({ CM: cmLabel }).result.CMID,
        name: `${cmLabel} Model`,
        description: "Performs work on behalf a single ObservableValueHelper cell.",

        apm: require("./AbstractProcessModel-ObservableValueWorker"),

        actions: [
        ],

        operators: [
        ],

        subcells: [
        ]


    });


    if (!cellModel.isValid()) {
        throw new Error(cellModel.toJSON());
    }

    module.exports = cellModel;

})();

