
const CellModel = require("../../../CellModel");

const cellModel = new CellModel({
    id: "MDVBKW89TvO9T62Ge7GmNg",
    name: "Holarchy Core",
    description: "Low-level glue models, actions, and operators for building re-usable infrastructure for execution within an ObservableProcessController (OPC) runtime host instance.",
    subcells: [
        require("./HolarchyCoreCell"),
        require("./HolarchyCoreLogic"),
        require("./HolarchyCoreMemory")
    ]
});

if (!cellModel.isValid()) {
    throw new Error(cellModel.toJSON());
}

module.exports = cellModel;

