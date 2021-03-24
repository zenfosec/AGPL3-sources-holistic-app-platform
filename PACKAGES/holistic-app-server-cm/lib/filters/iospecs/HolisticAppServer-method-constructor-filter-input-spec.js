"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO: app-server-method-constructor-input-spec.js
var holism = require("@encapsule/holism"); // holism helpfully exports all the information you need to splice together filter specs. But, it's TAF... No worries; it's now all encapsulated ;-)


var serviceTypes = require("@encapsule/holistic-app-common-cm").serviceTypes;

module.exports = {
  ____label: "HolisticNodeService::constructor Request Object",
  ____description: "A developer-defined descriptor object containing the information required to configure and initialize a holistic app service running inside a Node.js OS process.",
  ____types: "jsObject",
  appServiceCore: {
    ____label: "Holistic Service Core Definition",
    ____description: "A reference to your HolisticServiceCore class instance. Or, a descriptor object from which we can construct a new instance of HolisticServiceCore for use by your Node.js service.",
    ____accept: "jsObject" // Reference to HolisticAppCore instance

  },
  appTypes: {
    ____label: "Holistic Node.js Service Runtime Types",
    ____description: "Developer-defined runtime type definitions, and extensions to holistic-platform-defined types for a small set of core application-layer objects for which the Node.js service kernel provides runtime type filtering and/or generic orchestration services on behalf of the derived app service.",
    ____types: "jsObject",
    ____defaultValue: {},
    userLoginSession: {
      ____label: "App Service User Login Session Type Specs",
      ____description: "Holistic app platform provides runtime data filtering and orchestration of sensitive user login session information generically on behalf of your derived app service w/out dictacting at all how the derived app server process actually implements its authentication/authorization system(s).",
      ____types: "jsObject",
      ____defaultValue: {},
      trusted: {
        ____types: "jsObject",
        ____defaultValue: {},
        userIdentityAssertionDescriptorSpec: {
          ____label: "User Identity Assertion Descriptor Spec",
          ____description: "An assertion of a user's identity presented back to @encapsule/holism during HTTP request processing that contains a deserialized copy of the whatever information the app uses to represent such an assertion, e.g. a cookie.",
          ____accept: "jsObject",
          ____defaultValue: {
            ____label: "Default Non-Schematized (UNSAFE) User Identity Assertion Value",
            ____accept: "jsObject",
            ____defaultValue: {}
          }
        },
        userLoginSessionReplicaDataSpec: {
          ____label: "User Login Session Replica Descriptor Spec",
          ____description: "This is the format of the data that a registered @encapsule/holism service filter plug-in will receive when it is dispatched if the requester has attached a valid assertion of identity to the HTTP request (i.e. they are authenicated per application-specific and application-controlled code and constraints).",
          ____accept: "jsObject",
          ____defaultValue: {
            ____label: "Default Non-Schematized (UNSAFE) User Login Session Value",
            ____accept: "jsObject",
            ____defaultValue: {}
          }
        }
      }
    } // ~.userLoginSession

  },
  appModels: _objectSpread(_objectSpread({}, serviceTypes.HolisticServiceCore.constructor.appModels), {}, {
    ____label: "Holistic Node.js Service Behavior Models",
    ____description: "A collection of application-specific plug-in artifacts derived from @encapsule/holistic RTL's to register for use inside this holistic Node.js service instance.",
    ____types: "jsObject",
    ____defaultValue: {},
    httpRequestProcessor: {
      ____label: "Embedded HTTP Server Config",
      ____description: "Information used to specialize a HolisticAppServer class instance's embedded HTTP request processor.",
      ____types: "jsObject",
      ____defaultValue: {},
      // Currently, we rely on our rather old and humble @encapsule/holism RTL to provide HTTP request processing services.
      // It doesn't totally suck as it is. But, it's difficult to follow as it's lots of async stream processing, a non-trivial
      // visitor pattern integration API, obstruse service plug-in model etc. Anyway, someday we'll move it into CellProcessor
      // and clean it up substantially. But, for now we stuff most of the sharp edges behind this ES6 fascade to make it
      // simpler for developers to customize their app server (less options === more better). And, simpler for me to maintain
      // and evolve the backend infrastructure over time w/out impact or disruption on derived app's (how the HTTP requests
      // are processed in detail is no longer fully exposed to derived apps. This is intentional. If you need further degrees
      // of flexibility let me know; do not simply build new stuff to try to work-around the limitation(s). It is likely there's
      // a plan for that on the roadmap for the app server...
      holismConfig: {
        ____label: "Holism HTTP Server Config",
        ____description: "Initialization options, type and runtime behavior specializations for runtime-type filtered @encapsule/holism embedded HTTP 1.1 server instance.",
        ____types: "jsObject",
        ____defaultValue: {},
        options: _objectSpread({}, holism.filters.factories.server.filterDescriptor.inputFilterSpec.config.options),
        registrations: {
          ____label: "Derived App Service Server Integration Registrations",
          ____description: "Information used to specialize and customize the behavior of your derived app server service's embedded @encapsule/holism HTTP server.",
          ____types: "jsObject",
          ____defaultValue: {},
          resources: {
            ____label: "Holism HTTP Server Config Integrations",
            ____description: "Callback functions dispatched by HolisticAppServer constructor function to obtain configuration information from your derived app.",
            ____types: "jsObject",
            ____defaultValue: {},
            // Where a resource is defined to be a URL-mapped file cached on the Node.js heap.
            getMemoryFileRegistrationMap: {
              ____label: "Memory-Cached File Registration Map Accessor Function",
              ____description: "A synchronous callback function that is dispatched to obtain your app server's @encapsule/holism memory-cached registration map.",
              ____accept: "jsFunction"
            },
            // Or, a service filter plug-in mapped to a URL.
            getServiceFilterRegistrationMap: {
              ____label: "Service Filter Plug-In Registration Map Accessor Function",
              ____description: "A synchronous callback function that is dispatched to obtain your app server's @encapsule/holism service filter plug-in registration map.",
              ____accept: "jsFunction"
            }
          } // ~.appModels.httpRequestProcessor.holismConfig.registrations.resources

        },
        // ~.appModels.httpRequestProcessor.holismConfig.registrations
        lifecycle: {
          ____label: "Holism HTTP Server Request Lifecycle Integrations",
          ____description: "Callback functions dispatched by @encapsule/holism during HTTP request processing to obtain and customize information passed to all registered service filter plug-ins so that they can use the information to customize their HTTP response behavior(s).",
          ____types: "jsObject",
          ____defaultValue: {},
          redirectPreprocessor: {
            ____accept: ["jsNull", "jsFunction"],
            ____defaultValue: null
          },
          getUserIdentityAssertion: {
            ____accept: ["jsNull", "jsFunction"],
            ____defaultValue: null
          },
          getUserLoginSession: {
            ____accept: ["jsNull", "jsFunction"],
            ____defaultValue: null
          }
        },
        // ~.appModels.httpRequestProcessor.holismConfig.lifecycle
        // v0.0.49-spectrolite
        // This concept dates back to @encapsule/holism v1 in 2014.
        // Today we would model this concept differently and say that the app service will
        // define an action that the Node.js service's HTTP request processor can dispatch
        // as it requires when incoming HTTP requests are received. And, it would be up to
        // the application to maintain whatever context is required to support the implementation
        // of their specific action implementation. But, I don't have time to write a Node.js
        // service kernel right now. So, we deal with this pattern using the legacy implementation
        // here. It's not really horrible. It's just very unclear. Whatever the app developer splices
        // into appStateContext here will be passed by reference into their registered service filters.
        // i.e. compared to an action that would likely read its memory to obtain the same information,
        // here we push the details of where and how this object is built and what it means entirely
        // on the app developer. And, we just then pass it around on their behalf so that service filter
        // authors can just assume its part of their inbound request data and not worry about the
        // origin of the data.
        appStateContext: {
          ____label: "@encapsule/holism Service Filter State Context",
          ____description: "@encapsule/holism service filter plug-in \"context\" object is passed by @encapsule/holism to every service filter plug-in when it is dispatched. Developers may use this object to make app-specific backend subsystems (e.g. storage layer) consistently accessible to registered service filters.",
          ____accept: "jsObject",
          // We dodge here a little. HolisticNodeService constructor will always initialize and add @encapsule/d2r2 <ComponentRouter/> instance to appStateContext. It's NBD but inconsistent. Later this just dissapears entirely as above.
          ____defaultValue: {
            ComponentRouter: null
            /*constructed by HolisticNodeService constructor function*/

          }
        } // ~.appModels.httpRequestProcessor.holismConfig.appStateContext

      } // ~.httpServerConfig.holismConfig

    } // ~.httpServerConfig

  })
};