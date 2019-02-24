// sources/common/data/get-namespace-in-reference-from-path.js

const arccore = require("@encapsule/arccore");

var factoryResponse = arccore.filter.create({
    operationID: "Z7Z7OvwnQL-bRrOGfEy-ZQ",
    operationName: "Get Namespace Data In Reference From Path",
    operationDescription: "Retrieve data in namespace within memory-resident data indicated by sourceRef.",

    inputFilterSpec: {
        ____label: "Get Namespace In Reference From Path Request",
        ____types: "jsObject",
        namespacePath: {
            ____label: "Filter-Format Namespace Path",
            ____description: "A dot-delimited namespace path beginning with `~` (indicates anonymous root namespace).",
            ____accept: "jsString"
        },
        sourceRef: {
            ____label: "Source Data Reference",
            ____description: "A reference to the source data in which to locate the specified namespace.",
            ____accept: [ "jsNumber", "jsString", "jsBoolean", "jsObject", "jsArray" ]
        }
    },

    bodyFunction: function(request_) {

        var response = { error: null, result: null };
        var errors = [];
        var inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            var resolvedPathTokens = [];
            var pathTokens = request_.namespacePath.split(".");

            if (pathTokens.length === 1) {
                // Path specifies the entirety of sourceRef.
                response.result = request_.sourceRef;
                break;
            }
            if (pathTokens[0] !== "~") {
                errors.push("Incorrect specification for `namespacePath`. Must be a an ARCcore.filter-style dot-delimited path beginning with ~ indicating");
                errors.push("the anonymous reference `sourceRef`. Invalid path value '" + request_.namespacePath + "'.");
                break;
            }

            resolvedPathTokens.push(pathTokens.shift());

            var sourceRef = request_.sourceRef;

            while (pathTokens.length) {

                var innerResponse = arccore.types.check.inTypeSet({
                    types: [ "jsObject", "jsArray" ],
                    value: sourceRef
                });

                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }

                var isContainerNamespace = innerResponse.result;

                var token = pathTokens.shift();

                if (!isContainerNamespace) {
                    var actualType = arccore.types.convert({ from: "jsReference", to: "jsMoniker", value: sourceRef}).result;
                    var resolvedPath = resolvedPathTokens.join(".");
                    errors.push("Failed to resolve namespace path '" + request_.namespacePath + "':");
                    errors.push("Expected namespace '" + resolvedPath + "' to be either an array or object so that we can dereference the next namespace token '" + token + "'.");
                    errors.push("But, '" + resolvedPath + "' is actually an \"" + actualType + "\" entity type that does not have subnamespaces.");
                    break;
                }

                sourceRef = sourceRef[token];
                resolvedPathTokens.push(token);
            }

            if (errors.length)
                break;

            response.result = sourceRef;

            break;
        }

        if (errors.length)
            response.error = errors.join(" ");

        return response;

    },


    outputFilterSpec: {
        ____opaque: true // whatever it is, accept it as a valid response.result
    }


});

if (factoryResponse.error)
    throw new Error(factoryResponse.error);

module.exports = factoryResponse.result;
