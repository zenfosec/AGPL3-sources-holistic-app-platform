// http-server-generator-filter.js
//
/*
  An experimental HTTP 1.1 server built atop the low-level Node.js
  network socket, and HTTP API's (https://nodejs.org/api/http.html
  https://www.ietf.org/rfc/rfc2616.txt) using Encapsule Project
  ARCcore.filter and ARCcore.graph libraries.

  Features:

  - Configured with ARCcore.filter-derived plugin objects and JSON declarations.
  - Automated data validation/normalization/error reporting for superior developer experience.
  - Automated generation of human-readable API specifications and developer documentation.
  - Extended via ARCcore.filter-derived plugins:
  --- "Service filter" factory API provides developers w/a mechanism to define custom HTTP request logic.
  --- "Integration filter" factory API allows developers integrate HTTP server filters into their application.
  - Designed to work well with Encapsule/http-request-filter-factory (also based on ARCcore.filter).

  References:

  - Nodejs.org Anatomy of an HTTP Transaction: https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
  - Nodejs.org Streams: https://nodejs.org/api/stream.html
  - Wikipedia List of HTTP header fields: https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
  - Wikipedia list of HTTP status codes: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

*/
//

const packageMeta = require("../package.json");

const url = require("url");
const http = require("http");
const arccore = require("@encapsule/arccore");

// Low level response filters used directly by the HTTP server's listening thread.
const errorResponseFilter = require("./http-response-error-filter");
const writeResponseFilter = require("./http-response-write-filter");

// The format of the data required to call this filter.
const httpServerGeneratorRequestSpec = require("./iospecs/http-server-filter-factory-request-spec");

// The format of the data that this filter returns if the operation succeeds.
const httpServerGeneratorResultSpec = require("./iospecs/http-server-filter-factory-result-spec");

// Used internally to parse the request object and derive the representation used by the server.
const httpServerConfigProcessor = require("./http-server-config-filter");
const httpServerIntrospectionFilterFactory = require("./http-server-introspection-filter-factory");
const httpServerAgentInfoFilterFactory = require("./http-server-agent-info-filter-factory");

// Create the factory filter.
var factoryResponse = arccore.filter.create({
    operationID: "b46LcK7ORNu-lD_yUOsAuw",
    operationName: "HTTP Server Filter Factory",
    operationDescription: "Construct and initialize HTTP server infrastructure per configuration object.",
    inputFilterSpec: httpServerGeneratorRequestSpec,
    outputFilterSpec: httpServerGeneratorResultSpec,

    bodyFunction: function(request_) {

        var response = { error: null, result: null };
        var errors = [];

        // TODO: This needs some thought and then some refactoring
        var serverContext = request_;
        serverContext.generator = {};
        serverContext.generator[arccore.__meta.author + "/" + arccore.__meta.name] = arccore.__meta.version;
        serverContext.generator[packageMeta.author.name + "/" + packageMeta.name] = packageMeta.version;
        serverContext.instanceID = packageMeta.name + "-v" + packageMeta.version + "::" + arccore.identifier.irut.fromEther();

        serverContext.stats = {
            created: new Date(),
            started: null,
            requests: 0,
            responses: 0,
            errors: 0
        };

        var inBreakScope = false;
        while (!inBreakScope) {
            inBreakScope = true;
            console.log("**** HTTP server: " + serverContext.name + " - " + serverContext.description + " ****");
            console.log("\n* Processing server configuration:");
            var innerResponse = httpServerConfigProcessor.request(request_);
            if (innerResponse.error) {
                errors.unshift(innerResponse.error);
                errors.unshift("Unable to process HTTP server configuration object.");
                break;
            }

            var routingModel = innerResponse.result;

            serverContext.http_server_routes = {};

            var routeMethodNames = routingModel.getVertices().sort();
            routeMethodNames.forEach(function(route_) {
                var config = routingModel.getVertexProperty(route_);
                serverContext.http_server_routes[route_] = {};
                serverContext.http_server_routes[route_][config.type] = config.resource.id;
                var message = "> " + route_ + " ";
                var messageStartLength = message.length;
                for (var i=0 ; i < (70 - messageStartLength) ; i++) { message += "."; }
                message += " " + config.type;
                console.log(message);
            });

            // Allocate a default user session object for the 'anonymous' user.
            innerResponse = request_.integrations.filters.normalize_user_session_result.request();
            if (innerResponse.error) {
                errors.unshift(innerResponse.error);
                errors.unshift("Unable to create a default session descriptor for anonymous user.");
                break;
            }
            var anonymousUserSession = innerResponse.result;

            // ======================================================================
            // ======================================================================
            // ======================================================================
            // Define the generic server request handler callback function.


            const httpServer = http.createServer(

                // After the HTTP server starts listening on the designated port,
                // inbound HTTP requests will be dispatched to this callback for processing.
                //
                
                function(httpRequest_, httpResponse_) {

                    // Parse the request URL.
                    var parseUrl = url.parse(httpRequest_.url, true);

                    var httpMethod = (httpRequest_.method === "HEAD")?"GET":httpRequest_.method;
                    var routeMethodName = httpMethod + ":" + parseUrl.pathname;

                    // Deep copy the default user session data for anonymous user.
                    var anonymousUserSessionData = arccore.util.clone(anonymousUserSession);

                    // Initialize the request descriptor used to store request-derived state state.
                    var requestDescriptor = {
                        url_parse: parseUrl,
                        route_method_name: routeMethodName,
                        headers: httpRequest_.headers,
                        session: anonymousUserSessionData,
                        data: {
                            query: (parseUrl && parseUrl.search && parseUrl.search.length > 0)?parseUrl.query:undefined,
                            body: "" // <-- empty UTF8 string populated as IncomingStream data events fire. See httpRequest_.on('data')
                        }
                    };

                    // Increment the global request count.
                    serverContext.stats.requests++;

                    // ======================================================================
                    // Start: HORRIBLE MISHAP RESPONSE FUNCTION
                    // ----------------------------------------------------------------------
                    // When all else fails (and it often does if you happen to be messing around
                    // with new code) we display an ugly orange screen of server death detailing
                    // the request's demise.
                    //
                    function reportHorribleMishap(whatHappened_) {
                        console.error("REPORTING HORRIBLE SERVER MISHAP...");
                        console.log("----------------------------------------------------------------------");
                        console.log(whatHappened_);
                        console.log("----------------------------------------------------------------------");

                        var html = [
                            "<html>",
                            "<head>",
                            "<title>Status 500: Unhandled App Error</title>",
                            "<style type='text/css'>",
                            "body { font-family: Courier; background-color: #FC0; padding: 1em; }",
                            "h1 { font-family: Arial; font-size: 28pt; font-weight: bold; color: red; ",
                            "padding-bottom: 0.3em; border-bottom: 3px solid #F00; }",
                            "#idServer { text-align: right; color: red; font-family: Courier;  padding-top: 1em; border-top: 3px solid #F00; }",
                            "</style>",
                            "</head>",
                            "<body>",
                            "<h1>",
                            packageMeta.author.name + "/" + packageMeta.name + " Error 500",
                            "</h1>",
                            "<p><strong>An unhandled error occurred in the " + serverContext.name + " application:</strong></p>",
                            "<p>" + whatHappened_ + "</p>",
                            "<div id='idServer'>Encapsule/" + packageMeta.name + " v" + packageMeta.version + "</div>",
                            "</body>",
                            "</html>"
                        ].join("");

                        var lastResponse = writeResponseFilter.request({
                            streams: { request: httpRequest_, response: httpResponse_ },
                            request_descriptor: requestDescriptor,
                            response_descriptor: {
                                http: { code: 500, message: "Unhandled application error" },
                                content: {
                                    encoding: "utf8",
                                    type: "text/html"
                                },
                                data: html
                            }
                        });
                        if (lastResponse.error) {
                            console.error("Okay... Everything (and we mean everything) is broken. Please code responsibly!");
                            throw new Error(lastResponse.error);
                        }
                    }
                    // End: HORRIBLE MISHAP RESPONSE
                    // ======================================================================

                    console.log("====> " + routeMethodName + " (request: " + serverContext.stats.requests + ")");

                    /* TODO:
                       This is a simplisitic lowest-common-denominator implementation that could be better.
                       - Do not hook the data event if we have no expectation of data beyond headers / URL-encoded queries from the client.
                       - Allow developer-defined override behavor
                       - Direct raw access to underlying streams
                       - Handle non-UTF8-encoded payloads (e.g. binary file uploads)
                       - Handle long-running chunked POST/PUT from client (e.g. a sensor)
                       - Should also be predicated on authorization flags (i.e. if auth req. AND not auth'd then don't hook)
                    */
                    httpRequest_.on("data", function(data_) {
                        requestDescriptor.data.body += data_;
                        var dataLength = requestDescriptor.data.body.length;
                        if (dataLength > serverContext.config.options.max_input_characters) {
                            var innerResponse = errorResponseFilter.request({
                                integrations: serverContext.integrations,
                                streams: { request: httpRequest_, response: httpResponse_ },
                                request_descriptor: requestDescriptor,
                                error_descriptor: {
                                    http: { code: 413 },
                                    content: { encoding: "utf8", type: "application/json" },
                                    data: {
                                        error_message: "Request size exceeds maximum allowed by server.",
                                        error_context: { source_tag: "Le50YXPTR8i0TgstT4RUGg" }
                                    }
                                }
                            });
                            if (innerResponse.error) {
                                var problem = "During server attempt to respond to client request with error 404: " + innerResponse.error;
                                reportHorribleMishap(problem);
                            }
                        }
                        console.log("----> " + routeMethodName + "::data " + requestDescriptor.data.body.length);
                    });

                    httpRequest_.on("error", function(error_) {
                        // TODO: not even sure under what conditions this event fires so we're obviously
                        // not doing the right thing currently. Probably should close the socket?
                        console.error("!!!!> " + routeMethodName + "::error " + error_);
                    });

                    // ----------------------------------------------------------------------
                    // Everything that has come before is effectively an HttpRequest pre-processor
                    // that hooks the stream's events and prepares derived state context to pass off
                    // to various plug-ins (filters that we classify by role: integration, service).

                    httpRequest_.on("end", function() {
                        // Dereference normalized property object associated with recognized
                        // HTTP-method:pathname "route". Use the 'type' property to route top-level
                        // dispatch to route-specific subroutines.
                        var resourceDescriptor = routingModel.getVertexProperty(routeMethodName);

                        // Deserialize and extract the user's assertion of their identity (if they made one).
                        var innerResponse = serverContext.integrations.filters.get_user_identity.request({
                            request_descriptor: requestDescriptor,
                            appStateContext: serverContext.integrations.appStateContext
                        });
                        if (innerResponse.error) {
                            const problem = "During server attempt get user identity from HTTP request: " + innerResponse.error;
                            reportHorribleMishap(problem);
                            return;
                        }
                        var userIdentity = innerResponse.result;
                        console.log("... Asserted user identity: " + JSON.stringify(userIdentity));

                        // Attempt to authorize the user, and obtain the user's profile and current session data.
                        innerResponse = serverContext.integrations.filters.get_user_session.request({
                            appStateContext: serverContext.integrations.appStateContext,
                            user_identity: userIdentity,
                            result_handler: function(userSession_) {

                                var normalizeResponse =
                                    serverContext.integrations.filters.normalize_user_session_result.request(userSession_);
                                if (normalizeResponse.error) {
                                    reportHorribleMishap(normalizeResponse.error);
                                    return;
                                }
                                var userSession = normalizeResponse.result;

                                requestDescriptor.session = userSession;

                                // Reject unrecognized requests with error 404.
                                if (!routingModel.isVertex(routeMethodName)) {
                                    // ERROR 404: Unrecognized METHOD:pathname (routeMethodName)
                                    var innerResponse = errorResponseFilter.request({
                                        integrations: serverContext.integrations,
                                        streams: { request: httpRequest_, response: httpResponse_ },
                                        request_descriptor: requestDescriptor,
                                        error_descriptor: {
                                            http: { code: 404 },
                                            content: { encoding: "utf8", type: "text/html" },
                                            data: {
                                                error_message: "Invalid resource URL or access method.",
                                                error_context: { source_tag: "fjVt_DytRvGBbEWilKjr3w" }
                                            }
                                        }
                                    });
                                    if (innerResponse.error) {
                                        const problem = "During server attempt to respond to client request with error 404: " + innerResponse.error;
                                        reportHorribleMishap(problem);
                                    }
                                    return;
                                }

                                switch (resourceDescriptor.type) {

                                // ----------------------------------------------------------------------
                                // Static resources cached in-process memory.
                                // ----------------------------------------------------------------------
                                case "memory_file":
                                    // Dispatch for memory-resident file resources is trivial so affect
                                    // transfer of the static resource bits and close the response stream
                                    // inline below. Note that this implementation does not consider request
                                    // query, headers, or body whatsoever; it simply returns the resource
                                    // with the specified content type and encoding declared in the server
                                    // config descriptor.

                                    var lastETag =
                                        requestDescriptor.headers["if-none-match"] ||
                                        requestDescriptor.headers["If-None-Match"] ||
                                        requestDescriptor.headers["if-match"] ||
                                        requestDescriptor.headers["If-Match"];

                                    if (!lastETag) {
                                        console.log("It appears the user agent did not specify an ETag via If-None-Match header.");
                                    }
                                    if (lastETag === resourceDescriptor.resource.ETag) {
                                        // Resource has not changed since last request! Respond w/HTTP code 304
                                        // informing the user agent that it's okay to use its cached copy of the resource.
                                        console.log("Browser asserts ETag should be '" + lastETag + "' which is the LATEST! Responding w/304");
                                        innerResponse = writeResponseFilter.request({
                                            streams: { request: httpRequest_, response: httpResponse_ },
                                            request_descriptor: requestDescriptor,
                                            response_descriptor: {
                                                http: { code: 304, message: "Good to go!" },
                                                headers: {
                                                    ETag: resourceDescriptor.resource.ETag,
                                                    "Cache-Control": "must-revalidate"
                                                },
                                                content: { encoding: "utf8", type: "text/plain" },
                                                data: ""
                                            }
                                        });
                                        if (innerResponse.error) {
                                            const problem = "During server attempt to return HTTP code 304 response to client: " + innerResponse.error;
                                            reportHorribleMishap(problem);
                                        }
                                        break;
                                    }

                                    // Send the user agent an updated copy of the resource with an up-to-date ETag
                                    console.log("Browser asserts ETag should be '" + lastETag + "' which is the OUT-OF-DATE! Responding w/resource + 200");
                                    innerResponse = writeResponseFilter.request({
                                        streams: { request: httpRequest_, response: httpResponse_ },
                                        request_descriptor: requestDescriptor,
                                        response_descriptor: {
                                            http: { code: 200 },
                                            headers: {
                                                ETag: resourceDescriptor.resource.ETag,
                                                "Cache-Control": "must-revalidate"
                                            },
                                            content: {
                                                encoding: resourceDescriptor.resource.contentEncoding,
                                                type: resourceDescriptor.resource.contentType
                                            },
                                            data: resourceDescriptor.resource.data
                                        }
                                    });
                                    if (innerResponse.error) {
                                        const problem = "During server attempt to return in-memory file resource to client " +
                                              "w/expected status 200: " + innerResponse.error;
                                        reportHorribleMishap(problem);
                                    }
                                    break;

                                    // ----------------------------------------------------------------------
                                    // Dynamically composed resources accessed via plugin service filter request.
                                    // ----------------------------------------------------------------------
                                case "service_filter":
                                    // Delegate to the registered plug-in service filter.
                                    // Note that because plug-in service filters include unknown foreign code,
                                    // we make the filter call within a try/catch block and redirect exceptions
                                    // to an HTTP 500 response so that the server process continues listening
                                    // for subsequent requests.
                                    var serviceResponse = null;
                                    var options = arccore.util.clone(resourceDescriptor.resource.options);
                                    try {
                                        serviceResponse = resourceDescriptor.resource.filter.request({
                                            integrations: serverContext.integrations,
                                            request_descriptor: requestDescriptor,
                                            options: options,
                                            streams: { request: httpRequest_, response: httpResponse_ }
                                        });
                                    } catch (exception_) {
                                        console.log(exception_.stack);
                                        var detail = "Exception attempting to dispatch " + routeMethodName + ": '" + exception_.toString() + "'.";

                                        // Use the service filter's declared response content type;
                                        // We want an HTML render of the error if the service is intended to produce an HTML document.
                                        // Or, JSON in the typical case that the service implements an AJAX endpoint.
                                        var responseType = (resourceDescriptor.resource.contentType !== "text/html")?"application/json":"text/html";

                                        // ERROR 500: Runtime exception in plugin service filter.
                                        var errorResponse = errorResponseFilter.request({
                                            integrations: serverContext.integrations,
                                            streams: { request: httpRequest_, response: httpResponse_ },
                                            request_descriptor: requestDescriptor,
                                            error_descriptor: {
                                                http: { code: 500 },
                                                content: { encoding: "utf8", type: /*'text/html'*/responseType },
                                                data: {
                                                    error_message: detail,
                                                    error_context: {
                                                        source_tag: "IZWbFG3yRfqdgkBqS_Apaw"
                                                    }
                                                }
                                            }
                                        });
                                        if (errorResponse.error) {
                                            const problem = "During server attempt to report an unhandled application exception. " + errorResponse.error +
                                                  "<br><br>The original message was: " + detail;
                                            reportHorribleMishap(problem);
                                        }
                                        return;
                                    } // end catch
                                    if (serviceResponse.error) {
                                        // ERROR 400: Bad or invalid resource request.
                                        errorResponse = errorResponseFilter.request({
                                            integrations: serverContext.integrations,
                                            streams: { request: httpRequest_, response: httpResponse_ },
                                            request_descriptor: requestDescriptor,
                                            error_descriptor: {
                                                http: { code: 400 },
                                                content: { encoding: "utf8", type: "text/html" },
                                                data: {
                                                    error_message: serviceResponse.error,
                                                    error_context: { source_tag: "Kw65-1MVTuKgTS711UYYGQ" }
                                                }
                                            }
                                        });
                                        if (errorResponse.error) {
                                            const problem = "During server attempt to report a handled application error. " + errorResponse.error +
                                                  "<br><br>The original error was: " + serviceResponse.error;
                                            reportHorribleMishap(problem);
                                        }
                                    }
                                    break;

                                default:
                                    var message =  "Resource descriptor type '" + resourceDescriptor.type + "' is not yet implemented by the server.";
                                    // ERROR 405: Unknown/unsupported server resource registration.
                                    errorResponse = errorResponseFilter.request({
                                        integrations: serverContext.integrations,
                                        streams: { request: httpRequest_, response: httpResponse_ },
                                        request_descriptor: requestDescriptor,
                                        error_descriptor: {
                                            http: { code: 405 },
                                            content: { encoding: "utf8", type: "text/html" },
                                            data: {
                                                error_message: message,
                                                error_context: { source_tag: "vloqaQoWQd-w2TPr3N1WLg" }
                                            }
                                        }
                                    });
                                    if (errorResponse.error) {
                                        const problem = "While the server was attempting to reject the client request with error 405: " + errorResponse.error;
                                        reportHorribleMishap(problem);
                                    }

                                    break;
                                } // end switch
                            }, // integrations.get_user_session.result_handler
                            error_handler: function(error_) {
                                var normalizeError = serverContext.integrations.filters.normalize_user_session_error.request(error_);
                                if (normalizeError.error) {
                                    reportHorribleMishap(normalizeError.error);
                                    return;
                                }
                                const problem = "While processing request for user session: " + normalizeError.result;
                                reportHorribleMishap(problem);
                            } // integrations.get_user_session.error_handler
                        });
                        if (innerResponse.error) {
                            const problem = "During server attempt to get user session: " + innerResponse.error;
                            reportHorribleMishap(problem);
                            return;
                        }

                    }); // httpRequest_.on('end'...)
                }
            ); // httpRequestHandler function

            serverContext.common_filters = {
                error: errorResponseFilter,
                write: writeResponseFilter
            };

            // Introspection integration filter
            var innerFactoryResponse = httpServerIntrospectionFilterFactory.request(serverContext);
            if (innerFactoryResponse.error) {
                errors.unshift(innerFactoryResponse.error);
                break;
            }
            serverContext.integrations.filters.get_server_context = innerFactoryResponse.result;

            // Server agent info integration filter.
            innerFactoryResponse = httpServerAgentInfoFilterFactory.request(serverContext);
            if (innerFactoryResponse.error) {
                errors.unshift(innerFactoryResponse.error);
                break;
            }
            serverContext.integrations.filters.get_server_agent_info = innerFactoryResponse.result;

            response.result = {
                http_server_context: serverContext,
                http_server: httpServer,
                listen: function(port_) {
                    var serverName = routingModel.getGraphName();
                    serverContext.stats.started = new Date();
                    console.log("\n* Starting " + serverName + " HTTP server:");
                    httpServer.listen(port_, function() {
                        console.log("> " + serverName + " HTTP listening on port " + port_ + "...");
                    });
                }
            };
            break;
        }
        if (errors.length) {
            response.error = errors.join(" ");
        }
        return response;
    }

});

// Handle any error that occurred in arccore.filter.create
if (factoryResponse.error) {
    throw new Error(factoryResponse.error);
}

// Export the result filter object.
module.exports = factoryResponse.result;