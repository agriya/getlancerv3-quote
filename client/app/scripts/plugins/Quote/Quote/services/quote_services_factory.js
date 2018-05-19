'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.QuoteServicesFactory
 * @description
 * # QuoteServicesFactory
 * Factory in the getlancerApp.
 */
angular.module('getlancerApp')
    .factory('QuoteServicesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_services', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POSt'
            }
        });
  }])
    .factory('QuoteServiceFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_services/:quoteServiceId', {}, {
            get: {
                method: 'GET',
                params: {
                    quoteServiceId: '@quoteServiceId',
                    view: '@view'
                }
            },
            put: {
                method: 'PUT',
                params: {
                    quoteServiceId: '@quoteServiceId'
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    quoteServiceId: '@quoteServiceId'
                }
            }
        });
  }])
    .factory('QuoteServicesUserFactory', ['$resource', function($resource) {
        return $resource('/api/v1/users/:userId/quote_services', {}, {
            get: {
                method: 'GET',
                params: {
                    userId: '@userId'
                }
            }
        });
  }])
    .factory('QuoteServicesMeFactory', ['$resource', function($resource) {
        return $resource('/api/v1/me/quote_services', {}, {
            get: {
                method: 'GET'
            }
        });
  }])
	.factory('QuoteAutocompleteUsers', ['$resource', function($resource) {
        return $resource('/api/v1/users?type=freelancer', {}, {
            get: {
                method: 'GET'
            }
        });
  }]);