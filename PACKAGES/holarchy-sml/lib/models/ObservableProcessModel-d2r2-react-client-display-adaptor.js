"use strict";

// opm-d2r2-react-processor.js
var holarchy = require("@encapsule/holarchy");

var d2r2ReactClientDisplayAdaptorDeclaration = require("./declarations/ObservableProcessModel-d2r2-react-client-display-adaptor-declaration");

module.exports = new holarchy.ObservableProcessModel(d2r2ReactClientDisplayAdaptorDeclaration);