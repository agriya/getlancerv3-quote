'use strict';
/**
 * @ngdoc service
 * @name getlancerApp.CouponsFactory
 * @description
 * # CouponsFactory
 * Factory in the getlancerApp.
 */
angular.module('getlancerApp')
    .factory('CouponsFactory', ['$resource', function($resource) {
        return $resource('/api/v1/coupons', {}, {
            get: {
                method: 'GET'
            },
            create: {
                method: 'POST'
            }
        });
  }])
    .factory('CouponFactory', ['$resource', function($resource) {
        return $resource('/api/v1/coupons/:couponId', {}, {
            get: {
                method: 'GET',
                params: {
                    couponId: '@couponId'
                }
            },
            update: {
                method: 'PUT',
                params: {
                    couponId: '@couponId'
                }
            },
            remove: {
                method: 'DELETE',
                params: {
                    couponId: '@couponId'
                }
            }
        });
  }])
    .factory('CouponGetStatusFactory', ['$resource', function($resource) {
        return $resource('/api/v1/coupons/get_status/:coupon_code', {}, {
            get: {
                method: 'GET',
                params: {
                    coupon_code: '@coupon_code',
                    amount: '@amount'
                }
            }
        });
  }]);