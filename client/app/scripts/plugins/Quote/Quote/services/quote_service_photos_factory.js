'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.QuoteServicePhotosFactory
 * @description
 * # QuoteServicePhotosFactory
 * Factory in the getlancerApp.
 */
angular.module('getlancerApp.Quote')
    .factory('QuoteServicePhotosFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_service_photos', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
        });
  }])
    .factory('QuoteServicePhotoFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_service_photos/:quoteServicePhotoId', {}, {
            get: {
                method: 'GET',
                params: {
                    quoteServicePhotoId: '@quoteServicePhotoId'
                }
            },
            put: {
                method: 'PUT',
                params: {
                    quoteServicePhotoId: '@quoteServicePhotoId'
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    quoteServicePhotoId: '@quoteServicePhotoId'
                }
            },
        });
  }])
    .factory('QuoteServiceQuotePhotosFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_services/:quoteServiceId/quote_service_photos', {}, {
            get: {
                method: 'GET',
                params: {
                    quoteServiceId: '@quoteServiceId'
                }
            }
        });
  }]);