'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.QuoteFaqQuestionTemplatesFactory
 * @description
 * # QuoteFaqQuestionTemplatesFactory
 * Factory in the getlancerApp.
 */
angular.module('getlancerApp')
    .factory('QuoteFaqQuestionTemplatesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_faq_question_templates', {}, {
            get: {
                method: 'GET'
            },
            POST: {
                method: 'POST'
            }
        });
  }])
    .factory('QuoteFaqQuestionTemplateFactory', ['$resource', function($resource) {
        return $resource('/api/v1/quote_faq_question_templates/:quoteFaqQuestionTemplateId', {}, {
            get: {
                method: 'GET',
                params: {
                    quoteFaqQuestionTemplateId: '@quoteFaqQuestionTemplateId'
                }
            },
            put: {
                method: 'PUT',
                params: {
                    quoteFaqQuestionTemplateId: '@quoteFaqQuestionTemplateId'
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    quoteFaqQuestionTemplateId: '@quoteFaqQuestionTemplateId'
                }
            }
        });
  }]);