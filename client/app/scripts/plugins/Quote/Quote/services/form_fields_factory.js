'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.FormFieldsFactory
 * @description
 * # FormFieldsFactory
 * Factory in the getlancerApp.
 */
angular.module('getlancerApp')
    .factory('FormFieldsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/form_fields', {}, {
            get: {
                method: 'GET'
            },
            post: {
                method: 'POST'
            }
        });
  }])
    .factory('FormFieldFactory', ['$resource', function($resource) {
        return $resource('/api/v1/form_fields/:FormFieldId', {}, {
            get: {
                method: 'GET',
                params: {
                    FormFieldId: '@FormFieldId'
                }
            },
            put: {
                method: 'PUT',
                params: {
                    FormFieldId: '@FormFieldId'
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    FormFieldId: '@FormFieldId'
                }
            }
        });
  }]);