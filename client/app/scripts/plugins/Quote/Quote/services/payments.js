'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.PaymentOrderFactory
 * @description
 * # PaymentOrderFactory
 * Factory in the getlancerApp.
 */
angular.module('getlancerApp')
    .factory('PaymentOrderFactory', ['$resource', function($resource) {
        return $resource('/api/v1/order', {}, {
            create: {
                method: 'POST'
            }
        });
}]);