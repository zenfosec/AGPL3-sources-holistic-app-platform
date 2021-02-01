
const holarchy = require("@encapsule/holarchy");

const routerEventBus = require("./ObservableValue_router-event-descriptor");

module.exports = new holarchy.CellModel({
    id: "qzMWhMstQ4Ki06O75y5hMA",
    name: "DOM Location Processor",
    description: "Abstracts monitoring and setting the window.location and hashroute.",
    apm: require("./AbstractProcessModel-dom-location-processor"),
    actions: [
        require("./ControllerAction-dom-location-processor-initialize"),
        require("./ControllerAction-dom-location-processor-configure"),
        require("./ControllerAction-dom-location-processor-hashchange")
    ],
    subcells: [
        ...routerEventBus.cellmodels
    ]
});


