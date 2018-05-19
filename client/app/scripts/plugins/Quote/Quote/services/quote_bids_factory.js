'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.QuoteBidsFactory
 * @description
 * # QuoteBidsFactory
 * Factory in the getlancerApp.
 */
angular.module('getlancerApp')
    .factory('QuoteBidsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_bids', {}, {
            get: {
                method: 'GET'
            }
        });
  }])
    .factory('QuoteBidFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_bids/:quoteBidId', {}, {
            get: {
                method: 'GET',
                params: {
                    quoteBidId: '@quoteBidId'
                }
            },
            put: {
                method: 'PUT',
                params: {
                    quoteBidId: '@quoteBidId'
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    quoteBidId: '@quoteBidId'
                }
            }
        });
  }])
    .factory('QuoteRequestQuoteBidsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/requestor/:requestorId/quote_bids', {}, {
            get: {
                method: 'GET',
                params: {
                    requestorId: '@quoteRequestId'
                }
            }
        });
  }])
    .factory('QuoteRequestQuoteRequestFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_requests/:quoteRequestId', {}, {
            put: {
                method: 'PUT',
                params: {
                    quoteRequestId: '@quoteRequestId'
                }
            }
        });
  }])
   .factory('QuoteServicesStatusFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_services/me/service_stats', {}, {
            get: {
                method: 'GET',
            }
        });
  }])
    .factory('QuoteMeRequestsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/me/quote_requests', {}, {
            get: {
                method: 'GET',
            }
        });
  }])
    .factory('ServiceProvidersQuoteBidsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/service_providers/:serviceProviderUserId/quote_bids', {}, {
            get: {
                method: 'GET',
                params: {
                    serviceProviderUserId: '@serviceProviderUserId',
                    is_request_for_buy: '@is_request_for_buy'
                }
            }
        });
  }])
   .factory('ServiceProvidersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/me/quote_services', {}, {
            get: {
                method: 'GET',
            }
        });
  }]);