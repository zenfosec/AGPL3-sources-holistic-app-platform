// HolisticAppServerService-method-constructor-filter.js

const arccore = require("@encapsule/arccore");
const holism = require("@encapsule/holism");

const { HolisticAppCommon } = require("@encapsule/holistic-app-common-cm");

const inputFilterSpec = require("./iospecs/HolisticAppServer-method-constructor-filter-input-spec");
const outputFilterSpec =  require("./iospecs/HolisticAppServer-method-constructor-filter-output-spec");

const renderHtmlFunction = require("../../models/holism-http-server/render-html");

const factoryResponse = arccore.filter.create({
    operationID: "365COUTSRWCt2PLogVt51g",
    operationName: "HolisticAppServer::constructor Filter",
    operationDescription: "Validates/normalizes a HolisticAppServer::constructor function request descriptor object. And, returns the new instance's private state data.",
    inputFilterSpec,
    outputFilterSpec,
    bodyFunction: function(request_) {
        console.log(`HolisticAppServer::constructor [${this.operationID}::${this.operationName}]`);
        let response = {
            error: null,
            result: {
                appServiceCore: null, // null is an invalid value type per output filter spec set to force an error if the value isn't set appropriately by bodyFunction
                httpServerInstance: {
                    holismInstance: {
                        config: {
                            filters: {
                                getMemoryFileRegistrationMap: null, // as above
                                getServiceFilterRegistrationMap: null, // as above
                            },
                            data: {
                                memoryFileRegistrations: null, // as above
                                serviceFilterRegistrations: null // as above
                            }
                        }
                    }
                }
            }
        };
        let errors = [];
        let inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;

            // Cache the HolisticAppCommon definition.
            const appServiceCore = (request_.appServiceCore instanceof HolisticAppCommon)?request_.appServiceCore:new HolisticAppCommon(request_.appServiceCore);
            if (!appServiceCore.isValid()) {
                errors.push("Invalid appServiceCore value cannot be resolved to valid HolisticAppCommon class instance:");
                errors.push(response.result.appServiceCore.toJSON());
                break;
            }
            response.result.appServiceCore = appServiceCore;
            const appBuild = appServiceCore.getAppBuild();

            // Obtain build-time @encapsule/holism HTTP server config information from the derived app server.
            // These are function callbacks wrapped in filters to ensure correctness of response and to provide
            // developers with reference on format of the request value they are sent.

            // Create a filter to box the developer's getMemoryFileRegistrationMap callback function.
            let factoryResponse = arccore.filter.create({
                operationID: "tMYd-5e7Qm-iFV2TAufL6Q",
                operationName: "HolisticAppServer::constructor HTTP Mem-Cached Files Config Map Integration Filter",
                operationDescription: "Used to dispatch and validate the response.result of developer-defined getMemCachedFilesConfigMap function.",
                inputFilterSpec: {
                    ____types: "jsObject",
                    appBuild: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.holisticAppBuildManifest }, // <== THIS IS WRONG: we want this format set in common and we'll pick it up from there
                    deploymentEnvironment: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.appServerRuntimeEnvironment }
                },
                outputFilterSpec: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.files },
                bodyFunction: request_.httpServerConfig.holismConfig.registrations.resources.getMemoryFileRegistrationMap
            });
            if (factoryResponse.error) {
                errors.push("Cannot build a wrapper filter to retrieve your app server's memory-cached file configuration map due to error:");
                errors.push(factoryResponse.error);
                break;
            }
            const getMemoryFileRegistrationMapFilter = response.result.httpServerInstance.holismInstance.config.filters.getMemoryFileRegistrationMap = factoryResponse.result;

            // Create a filter to box the developer's getServiceFilterRegistrationMap callback function.
            factoryResponse = arccore.filter.create({
                operationID: "0suEywsvTl200kgcEVBsLw",
                operationName: "HolisticAppServer::constructor HTTP Service Filter Config Map Integration Filter",
                operationDescription: "Used to dispatch and validate the response.result of developer-defined getServiceFilterConfigMap function.",
                inputFilterSpec: {
                    ____types: "jsObject",
                    appBuild: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.holisticAppBuildManifest }, // <== THIS IS WRONG: we want this format set in common and we'll pick it up from there
                    deploymentEnvironment: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.appServerRuntimeEnvironment }
                },
                outputFilterSpec: { ...holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.services },
                bodyFunction: request_.httpServerConfig.holismConfig.registrations.resources.getServiceFilterRegistrationMap
            });
            if (factoryResponse.error) {
                errors.push("Cannot build a wrapper filter to retrieve your app server's service filter configuration map due to error:");
                errors.push(factoryResponse.error);
                break;
            }
            const getServiceFilterRegistrationMapFilter = response.result.httpServerInstance.holismInstance.config.filters.getServiceFilterRegistrationMap = factoryResponse.result;

            // Get the derived app server's memory file registration map via our filter.
            const callbackRequest = {
                appBuild,
                deploymentEnvironment: "development" // <======== TODO
            }; // TODO deploymentEnvironment

            let filterResponse = getMemoryFileRegistrationMapFilter.request(callbackRequest);
            if (filterResponse.error) {
                errors.push("An error occurred while querying your app server for its memory file registration map:");
                errors.push(filterResponse.error);
                break;
            }
            const appServerMemoryFileRegistrationMap = response.result.httpServerInstance.holismInstance.config.data.memoryFileRegistrations = filterResponse.result;

            // Get the derived app server's service filter plug-in registration map.
            filterResponse = getServiceFilterRegistrationMapFilter.request(callbackRequest);
            if (filterResponse.error) {
                errors.push("An error occured while querying your app server for its service filter plug-in registration map:");
                errors.push(filterResponse.error);
                break;
            }
            const appServerServiceFilterRegistrationMap = response.result.httpServerInstance.holismInstance.config.data.serviceFilterRegistrations = filterResponse.result;

            // Okay - so nothing has gone wrong so far!
            // We should now have enough information to construct what the @encapsule/holism RTL calls "integration filters" that wrap a bunch of callback functions
            // in filters that are subsequently dispatched at various phases of an HTTP request lifecycle in order to ask questions of and/or delegate behaviors
            // to the derived app service (i.e. application-layer facilities, behaviors, features, etc. added to the app server via the available platform-defined
            // extension points). We don't want to really play games w/@encapsule/holism right now so am pretty much just building a super-precise and generic
            // implementation of what a developer might otherwise have to figure out how to do inside SOURCES/SERVER/server.js (which is quite a bit actually
            // to stay in sync w/the app client work in particular).

            const appMetadataTypeSpecs = appServiceCore.getAppMetadataTypeSpecs();

            // v0.0.49-spectrolite
            // This is a very old abstraction (circa 2015?) Wiring this up here 5-years later I think it's pretty good insofar
            // as this factory provides a succinct request API the distills the factory input requirements. What we do not need
            // is to implement runtime synthesis of filters in @encapsule/holism (or any other RTL for that matter) now that we
            // have CellProcessor in 2020. No time to make the swap over now (it's straight-forward but would take 1+ month to
            // build a runtime service environment in CellProcessor atop Node.js similar to what we are about to unleash in the
            // browser tab.

            factoryResponse = holism.integrations.create({
                filter_id_seed: "M4MFr-ZvS3eovgdTnNTrdg", // TODO: Confirm my assumption that this can be any static IRUT w/out violating any important invariant assumptions about the derived IRUTs...
                name: `${appBuild.app.name} @encapsule/holism Lifecycle Integration Filters`,
                description: "A set of filters leverages by the @encapsule/holism HTTP request processor to obtain information and/or delegate behaviors to the derived app server service process.",
                version: `${appBuild.app.version}`,
                // ----------------------------------------------------------------
                appStateContext: { }, // This is an escape hatch mitigation for not having a HolisticAppServerKernel cell process to hold context.
                // It's okay for now I think. But, it needs to be connected so that app-server-provided @encapsule/holism service filter plug-in registrations
                // can follow whatever ad-hoc access protocol they desire to access the data/functions/objects ? carried in this namespace.
                // ----------------------------------------------------------------
                integrations: {
                    preprocessor: {
                        redirect: request_.httpServerConfig.holismConfig.lifecycle.redirectProcessor
                    },
                    metadata: {
                        // This doesn't need to be all fancy like this. Metadata has grown beyond just the sphere of @encapsule/holism
                        // and many of the patterns I devised when I wrote it initially don't make that much sense. Like the org and
                        // app callbacks are utter nonsense we could cut. But, I would have to think about it.
                        org: {
                            get: {
                                bodyFunction: function() {
                                    return ({ error: null, result: appServiceCore.getAppMetadataOrg() });
                                },
                                outputFilterSpec: appMetadataTypeSpecs.org
                            }
                        },
                        site: { // aka app metadata app (whatever)
                            get: {
                                bodyFunction: function() {
                                    return ({ error: null, result: appServiceCore.getAppMetadataApp() });
                                },
                                outputFilterSpec: appMetadataTypeSpecs.app
                            }
                        },
                        page: {
                            get: {
                                bodyFunction: function({ http_code, resource_uri }) {
                                    const queryResult = appServiceCore.getAppMetadataPage(resource_uri);
                                    if (queryResult instanceof String) {
                                        return ({ error: queryResult });
                                    }
                                    return ({ error: null, result: queryResult });
                                },
                                outputFilterSpec: appMetadataTypeSpecs.pages.pageURI
                            }
                        },
                        session: {
                            get_identity: {
                                bodyFunction: request_.httpServerConfig.holismConfig.lifecycle.getUserIdentityAssertion,
                                outputFilterSpec: request_.appTypes.userLoginSession.trusted.userIdentityAssertionDescriptorSpec
                            },
                            get_session: {
                                bodyFunction: request_.httpServerConfig.holismConfig.lifecycle.getUserLoginSession,
                                response: {
                                    result_spec: request_.appTypes.userLoginSession.trusted.userLoginSessionReplicaDataSpec,
                                    client_spec: appServiceCore.getClientUserLoginSessionSpec()
                                }
                            }
                        }
                    },
                    render: {
                        html: {
                            bodyFunction: renderHtmlFunction
                        }
                    }
                }
            });
            if (factoryResponse.error) {
                errors.push("Well... Things were going pretty well until we tried to wrap your app server lifecycle callback function registrations in filters >:/");
                errors.push(factoryResponse.error);
                break;
            }

            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }

        // Wow... That's a lot of information ;-)
        // console.log(JSON.stringify(response, undefined, 4));

        return response;
    }
});

if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;