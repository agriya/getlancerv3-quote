'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.FaqsFactory
 * @description
 * # FaqsFactory
 * Factory in the getlancerApp.
 */
angular.module('getlancerApp')
    .factory('FaqAnswersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_faq_answers', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
        });
  }])
    .factory('FaqAnswerFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_faq_answers/:quoteFaqAnswerId', {}, {
            get: {
                method: 'GET',
                params: {
                    quoteFaqAnswerId: '@quoteFaqAnswerId'
                }
            },
            put: {
                method: 'PUT',
                params: {
                    quoteFaqAnswerId: '@quoteFaqAnswerId'
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    quoteFaqAnswerId: '@quoteFaqAnswerId'
                }
            }
        });
  }])
    .factory('QuoteServiceFaqAnswersFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_services/:quoteServiceId/quote_faq_answers', {}, {
            get: {
                method: 'GET',
                params: {
                    quoteServiceId: '@quoteServiceId'
                }
            }
        });
  }]);