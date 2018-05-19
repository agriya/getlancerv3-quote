'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.QuoteServiceCategoriesFactory
 * @description
 * # QuoteServiceCategoriesFactory
 * Factory in the getlancerApp.
 */
angular.module('getlancerApp')
    .factory('QuoteServiceCategoriesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_categories', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
        });
  }])
    .factory('QuoteCategoriesQuoteServicesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_categories_quote_services', {}, {
            get: {
                method: 'GET'
            }
        });
  }])
    .factory('QuoteServiceCategoryFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_categories/:quoteCategoryId', {}, {
            get: {
                method: 'GET',
                params: {
                    quoteServiceId: '@quoteServiceId'
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
  }]);