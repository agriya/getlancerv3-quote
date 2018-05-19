'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.MessagesFactory
 * @description
 * # MessagesFactory
 * Factory in the getlancerApp.
 */
angular.module('getlancerApp')
    .factory('MessagesFactory', ['$resource', function($resource) {
        return $resource('/api/v1/messages', {}, {
            get: {
                method: 'GET'
            },
            create: {
                method: 'POST'
            }
        });
  }])
    .factory('MessageFactory', ['$resource', function($resource) {
        return $resource('/api/v1/messages/:messageId', {}, {
            get: {
                method: 'GET',
                params: {
                    messageId: '@messageId'
                }
            }
        });
  }]);