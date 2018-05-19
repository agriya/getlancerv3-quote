'use strict';
/*
*quote activities factory
*/
angular.module('getlancerApp.Quote')
	.factory('QuoteActivitiesFactory', ['$resource', function ($resource) {
		return $resource('/api/v1/activities', {}, {
            get: {
                method: 'GET'
            }
        });
	}])
    .factory('MeQuoteActivitiesFactory', ['$resource', function ($resource) {
		return $resource('/api/v1/me/activities', {}, {
            get: {
                method: 'GET'
            }
        });
	}]);