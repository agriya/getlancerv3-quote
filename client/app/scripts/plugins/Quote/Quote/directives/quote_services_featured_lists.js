'use strict';
/**
 * @ngdoc directive
 * @name getlancerApp.directive:QuoteServicesFeaturedLists
 * @description
 * # QuoteServicesFeaturedLists
 */
angular.module('getlancerApp')
    .directive('quoteServicesFeaturedLists', function(QuoteServicesFactory, md5, $window) {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/home_featured.html',
            restrict: 'E',
            replace: 'true',
            link: function postLink(scope, element, attrs) {
                var params = {
                    limit: 4,
                    filter: 'active'
                };
                QuoteServicesFactory.get(params, function(response) {
                    if (angular.isDefined(response.data)) {
                        angular.forEach(response.data, function(value) {
                            if (angular.isDefined(value) && value !== null) {
                                value.image_name = $window.theme + 'images/no-image.png';
                                if (angular.isDefined(value.attachment) && value.attachment !== null) {
                                    var hash = md5.createHash(value.attachment.class + value.attachment.foreign_id + 'png' + 'medium_thumb');
                                    value.image_name = 'images/medium_thumb/' + value.attachment.class + '/' + value.attachment.foreign_id + '.' + hash + '.png';
                                }
                            }
                        });
                        scope.featured_lists = response.data;
                    }
                });
            }
        };
    });