'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.QuoteRequestFactory
 * @description
 * # QuoteRequestFactory
 * Factory in the getlancerApp.
 */
angular.module('getlancerApp')
    .factory('QuoteRequestsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_requests', {}, {
            post: {
                method: 'POST',
                params: {
                    radius: '@radius'
                }
            },
            get: {
                method: 'GET'
            }
        });
  }])
    .factory('QuoteRequestFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_requests/:quoteRequestId', {}, {
            get: {
                method: 'GET',
                params: {
                    quoteRequestId: '@quoteRequestId'
                }
            },
            put: {
                method: 'PUT',
                params: {
                    quoteRequestId: '@quoteRequestId'
                }
            },
            post: {
                method: 'POST',
                params: {
                    quoteRequestId: '@quoteRequestId'
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    quoteRequestId: '@quoteRequestId'
                }
            }
        });
  }])
    .factory('QuoteRequestUserFactory', ['$resource', function($resource) {
        return $resource('/api/v1/me/quote_requests', {}, {
            get: {
                method: 'GET'
            }
        });
  }])
  .factory('QuoteRequestStatusFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_requests/me/stats', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);