// @encapsule/holarchy/server-api.js

module.exports = {

    library: {

        data: {
            gateway: {
                router: {
                    // Creates a filter that routes a service filter request to 1:N service filters.
                    factory: require("./server/services/data-gateway/data-gateway-router-factory")
                },
                // Reusable generic data gateway service that utilizes the application's specialized
                // service filter router to delegate HTTP request processing to a specific service filter
                // based on the format of the incoming HTTP request.
                service: require("./server/services/service-data-gateway") // @encapsule/holism service
            }
        },

        // Reusable @encapsule/holism service filters that an application can register on their own app server instance.
        // Unless otherwise indicated in comments below, these service filters are pre-built and exported as they
        // are intended to be registered via @encapsule/holism service configuration declaration(s). In other cases,
        // application developers must explicitly construct the service filter to register by providing additional
        // information to a factory filter that produces the final filter that is expected to be registered.
        //

        services: {

            DataGateway: require("./server/services/service-data-gateway"),

            HealthCheck: require("./server/services/service-health-check"),
            MarkdownFromFilesystem: require("./server/services/service-fs-markdown-render"),
            OptionsAsHtmlContent: require("./server/services/service-options-as-html-content"),

            Developer_AppDataStoreIntegrations: require("./server/services/service-developer-get-app-data-store-integrations"),
            Developer_AppDataStoreFilterSpec: require("./server/services/service-developer-get-app-data-store-filter-spec")


        } // services

    }

};

