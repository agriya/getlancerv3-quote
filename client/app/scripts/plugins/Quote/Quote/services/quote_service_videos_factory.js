'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.Quote.QuoteServiceVideosFactory
 * @description
 * # QuoteServiceVideosFactory
 * Factory in the getlancerApp.Quote.
 */
angular.module('getlancerApp.Quote')
    .factory('QuoteServiceVideosFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_service_videos', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
        });
  }])
    .factory('QuoteServiceVideoFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_service_videos/:quoteServiceVideoId', {}, {
            get: {
                method: 'GET',
                params: {
                    quoteServiceVideoId: '@quoteServiceVideoId'
                }
            },
            put: {
                method: 'PUT',
                params: {
                    quoteServiceVideoId: '@quoteServiceVideoId'
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    quoteServiceVideoId: '@quoteServiceVideoId'
                }
            }
        });
  }])
    .factory('QuoteServiceQuoteVideosFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_services/:quoteServiceId/quote_service_videos', {}, {
            get: {
                method: 'GET',
                params: {
                    quoteServiceId: '@quoteServiceId'
                }
            }
        });
  }]);