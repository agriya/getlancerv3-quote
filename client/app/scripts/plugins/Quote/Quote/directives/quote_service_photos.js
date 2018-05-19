'use strict';
/**
 * @ngdoc directive
 * @name getlancerApp.directive:quoteServicePhotos
 * @description
 * # quoteServicePhotos
 */
angular.module('getlancerApp.Quote')
    .directive('quoteServicePhotos', function(QuoteServiceQuotePhotosFactory, md5, $window) {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_photos.html',
            restrict: 'E',
            replace: 'true',
            link: function postLink(scope, element, attrs) {
                var params = {
                    quoteServiceId: scope.quote_services
                };
                QuoteServiceQuotePhotosFactory.get(params, function(response) {
                    if (angular.isDefined(response.data)) {
                        angular.forEach(response.data, function(value) {
                            if (angular.isDefined(value) && value !== null) {
                                angular.forEach(value.attachment, function(newvalue) {
                                    newvalue.image_name = $window.theme + 'images/no-image.png';
                                    if (angular.isDefined(newvalue.id) && newvalue.foreign_id !== null) {
                                        var hash = md5.createHash(newvalue.class + newvalue.foreign_id + 'png' + 'medium_thumb');
                                        newvalue.image_name = 'images/medium_thumb/' + newvalue.class + '/' + newvalue.foreign_id + '.' + hash + '.png';
                                    }
                                });
                            }
                        });
                        scope.quote_service_photos = response.data;
                    }
                });
            }
        };
    });