// ControllerAction-dom-client-event-sink-hashchange.js

const holarchy = require("@encapsule/holarchy");
const queryString = require("query-string");
const url = require("url");


module.exports = new holarchy.ControllerAction({
    id: "peTmTek_SB64-ofd_PSGjg",
    name: "DOM Client Location Processor: 'hashchange'",
    description: "Accepts info about the 'hashchange' event and encapsulates the details of updating the DOM Client Locaiton Processor APM memory to record the event details.",
    actionRequestSpec: {
        ____types: "jsObject",
        holistic: {
            ____types: "jsObject",
            app: {
                ____types: "jsObject",
                client: {
                    ____types: "jsObject",
                    domLocation: {
                        ____types: "jsObject",
                        _private: {
                            ____types: "jsObject",
                            notifyEvent: {
                                ____types: "jsObject",
                                hashchange: {
                                    ____accept: "jsBoolean",
                                    ____inValueSet: [ true ]
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    actionResultSpec: { ____accept: "jsUndefined" }, // action returns no response.result
    bodyFunction: (request_) => {

        let response = { error: null };
        let errors = [];
        let inBreakScope = false;

        while (!inBreakScope) {
            inBreakScope = true;

            // v0.0.47-kyanite note
            // Been a long time since I've been in this module...
            // Okay - what's actually important is to take some of the fine details of the logic
            // below (there are some critical nuances to dealing w/initialization) and then
            // and convert the rest over to push a notification through the derived app client's
            // hashroute lifecycle action. I had previously guessed we might observe this model's
            // process step to deduce hash changes. We may still do that someday. But, for now it's
            // much simpler to understand that you need to implement lifecycle action hashroute
            // if you want something to happen vs you need to write a CellModel that observes another
            // blah blah blah...


            console.log(`> Current value of location.href is '${location.href}'`);

            let ocdResponse = request_.context.ocdi.readNamespace(request_.context.apmBindingPath);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }
            const cellMemory = ocdResponse.result;

            // v0.0.48-kyanite - Isn't this handled correctly by ControllerActoin-dom-location-processor-initialize.js?
            // Set a breakpoint in here; does it ever get hit. We should be able to remove this and make this logic simpler
            // to understand.
            if (cellMemory.outputs.currentRoute && (cellMemory.outputs.currentRoute.href === location.href)) {
                console.log("> This event will be ignored. It was induced by the DOM Location Processor's init action replacing the server's non-hashroute with the default, #.");
                console.log("HEY WE DIDN'T ACTUALLY EXPECT THIS TO HAPPEN. SET A BREAKPOINT HERE AND FIGURE THIS SHIT OUT.");
                break;
            }

            const hrefParse = url.parse(location.href);

            const hashrouteParseRaw = url.parse(hrefParse.hash.slice(1));

            const hashrouteParse = {
                pathname: `#${hashrouteParseRaw.pathname?hashrouteParseRaw.pathname:""}`,
                path: `#${hashrouteParseRaw.path?hashrouteParseRaw.path:""}`,
                search: hashrouteParseRaw.search,
                query: hashrouteParseRaw.query
            };

            const routerEventDescriptor = {
                actor: ((cellMemory.private.routerEventCount === cellMemory.private.lastOutputEventIndex)?(cellMemory.private.routerEventCount?"user":"server"):"app"),
                hashrouteString: hrefParse.hash,
                hashrouteParse,
                hashrouteQueryParse: queryString.parse(hashrouteParse.query),
                routerEventNumber: cellMemory.private.routerEventCount
            };

            cellMemory.private.locationHistory.push(routerEventDescriptor);
            cellMemory.private.routerEventCount++;

            // v0.0.48-kyanite -- Really need to untangle the little matrix of possibilities here
            // and make sure they're all 100%. This is some sort of accomodation to discriminate
            // between if the hashchange event occurred because the app client set the location
            // vs the user set the location via the browser.
            if (cellMemory.private.routerEventCount > cellMemory.private.lastOutputEventIndex) {
                cellMemory.private.lastOutputIndex++;
                cellMemory.private.updateObservers = true;
                cellMemory.outputs.currentRoute = routerEventDescriptor;
            } // if notify observers

            // v0.0.48-kyanite -- So, here we update the cell's OCD memory based on the logic above.
            ocdResponse = request_.context.ocdi.writeNamespace(request_.context.apmBindingPath, cellMemory);
            if (ocdResponse.error) {
                errors.push(ocdResponse.error);
                break;
            }

            // if cellMemory.private.updateObservers - we can now call the derived app client process' hashroute lifecycle action and tell them

            if (cellMemory.private.updateObservers) {
                let actResponse = request_.context.act({
                    actorName: "DOMLocationProcessor",
                    actionTaskDescription: "Informing the app client service of udpate to the current hashroute location data.",
                    actionRequest: {
                        CellProcessor: {
                            cell: {
                                delegate: {
                                    cell: cellMemory.derivedAppClientProcessCoordinates,
                                    actionRequest: { holistic: { app: { client: { lifecycle: { hashroute: { ...routerEventDescriptor } } } } } }
                                }
                            }
                        }
                    },
                    apmBindingPath: request_.context.apmBindingPath
                });
                if (actResponse.error) {
                    errors.push(actResponse.error);
                    break;
                }

            } else {
                console.log("HEY --- This is ControllerAction-dom-location-sink-event-hashchange wondering if it's actually appropriate to drop this hashchange event on the floor and not call the derived app client hashroute lifecycle action?")
            }

            break;

        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }
});