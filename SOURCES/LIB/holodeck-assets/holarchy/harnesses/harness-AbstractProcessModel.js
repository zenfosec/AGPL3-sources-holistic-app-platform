
const holodeck = require("@encapsule/holodeck");
const holarchy = require("@encapsule/holarchy");

const factoryResponse = holodeck.harnessFactory.request({
    id: "mC3pPO5wS3SxvhgZgMjsJQ",
    name: "AbstractProcessModel Harness",
    description: "Constructs an instance of ES6 class AbstractProcessModel that is serialized and passed back as response.result.",

    // idempotent

    testVectorRequestInputSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            holarchy: {
                ____types: "jsObject",
                AbstractProcessModel: {
                    ____types: "jsObject",
                    constructorRequest: {
                        // Either a AbstractProcessModel constructor request object or pre-constructed AbstractProcessModel class instance reference.
                        ____opaque: true
                    }
                }
            }
        }
    }, // testVectorRequestInputSpec

    testVectorResultOutputSpec: {
        ____accept: "jsObject" // TODO: Tighten this up
    }, // testVectorResultOutputSpec

    harnessBodyFunction: function(request_) {

        const messageBody = request_.vectorRequest.holistic.holarchy.AbstractProcessModel;
        const observableProcessModel = (messageBody.constructorRequest instanceof holarchy.AbstractProcessModel)?messageBody.constructorRequest:new holarchy.AbstractProcessModel(messageBody.constructorRequest);

        const response = {
            error: null,
            result: {
                isValid: observableProcessModel.isValid(),
                toJSON: observableProcessModel.toJSON(),
                getID: observableProcessModel.getID(),
                getName: observableProcessModel.getName(),
                getDescription: observableProcessModel.getDescription(),
                getDataSpec: observableProcessModel.getDataSpec(),
                getDigraph: observableProcessModel.getDigraph()
            }
        };

        return response;

    } // harnessBodyFunction

});

if (factoryResponse.error) {
    throw new Erorr(factoryResponse.error);
}

module.exports = factoryResponse.result;


