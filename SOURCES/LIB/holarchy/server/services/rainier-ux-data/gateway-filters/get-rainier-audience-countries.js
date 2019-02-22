// sources/server/services/service-rainier-ux-data/gateway-filters/get-rainier-audience-countries.js

const dataGatewayFilterFactory = require('../lib/data-gateway-filter-factory');
const buildOutgoingHeaders = require('../lib/build-outgoing-headers-for-backend-proxy');
const rainierProxyGetCountries = require('../../../communication/rainier/get-country-segments-request-filter');

var factoryResponse = dataGatewayFilterFactory.request({
  id: "l7O2N2FGTwqFFcly75nXRw",
  name: "POST Rainier Countries",
  description: "Proxies a request to the Rainier backend to get country segments",

  gatewayMessageSpec: {
    ____types: "jsObject",
    GET: {
      ____types: "jsObject",
      backend: {
        ____types: "jsObject",
        rainier: {
            ____types: "jsObject",
            audienceCountries: {
                ____types: "jsObject",
                pcode: {
                    ____label: "Advertiser pcode",
                    ____description: "The current advertiser pcode to be included in the qaccount header",
                    ____accept: "jsString"
                } //pcode
            } // audienceCountries
        } // rainier
      } // backend
    } // GET
  }, // gatewayMessageSpec

  gatewayMessageHandler: function (gatewayRequest_) {

    var response = {error: null, result: null};
    var errors = [];
    var inBreakScope = false;
    while (!inBreakScope) {
      inBreakScope = true;
      console.log("get country segments");
      let response_filters = gatewayRequest_.gatewayServiceFilterRequest.response_filters;
      let streams = gatewayRequest_.gatewayServiceFilterRequest.streams;
      let integrations = gatewayRequest_.gatewayServiceFilterRequest.integrations;
      let request_descriptor = gatewayRequest_.gatewayServiceFilterRequest.request_descriptor;
      const incomingRequestHeaders = gatewayRequest_.gatewayServiceFilterRequest.request_descriptor.headers;

      const pcode = gatewayRequest_.gatewayMessage.GET.backend.rainier.audienceCountries.pcode;
      var httpProxyResponse = rainierProxyGetCountries.request({

        options: {headers: buildOutgoingHeaders(gatewayRequest_, pcode)},

        resultHandler: function (result_) {
          console.log("rainierProxyGetCountries.result");
          console.log(JSON.stringify(result_, undefined, 4));
          response_filters.result.request({
            streams: streams,
            integrations: integrations,
            request_descriptor: request_descriptor,
            response_descriptor: {
              http: {code: 200, message: "Rainier!"},
              content: {encoding: 'utf8', type: 'application/json'},
              data: result_
            }
          });
        },

        errorHandler: function (error_) {
          console.log("Errror getting country segments");
          console.log(JSON.stringify(error_, undefined, 4));
          response_filters.result.request({
            streams: streams,
            integrations: integrations,
            request_descriptor: request_descriptor,
            response_descriptor: {
              http: {code: 400},
              content: {encoding: 'utf8', type: 'application/json'},
              data: {
                error_message: error_,
                error_context: {source_tag: "rainier-ux-base::9HbAM0mTQfyXt_EbBgVgnA"}
              }
            }
          });
        }
      });

      if (httpProxyResponse.error) {
        errors.push(httpResponse.error);
        break;
      }

      // No meaningful response.result.
      break;
    }
    if (errors.length) {
      response.error = errors.join(' ');
    }

    return response;

  }

});

if (factoryResponse.error) {
  throw new Error(factoryResponse.error);
}

module.exports = factoryResponse.result;


