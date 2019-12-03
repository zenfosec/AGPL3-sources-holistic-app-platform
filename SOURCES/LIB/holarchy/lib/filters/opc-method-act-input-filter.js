
// Copyright (C) 2019 Christopher D. Russell

const arccore = require("@encapsule/arccore");

const opcMethodActInputSpec = require("./iospecs/opc-method-act-input-spec");

const factoryResponse = arccore.filter.create({
    operationID: "HcpOJr6nRYWCu4_J1v7wIw",
    operationName: "OPC.act Input Stage Filter",
    operationDescription: "Validates/normalizes request descriptor object passed to ObservableProcessController.act method.",
    inputFilterSpec: opcMethodActInputSpec
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;
