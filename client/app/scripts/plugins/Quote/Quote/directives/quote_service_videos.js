'use strict';
/**
 * @ngdoc directive
 * @name getlancerApp.Quote.directive:quoteServiceVideos
 * @description
 * # quoteServiceVideos
 */
angular.module('getlancerApp.Quote')
    .directive('quoteServiceVideos', function(QuoteServiceQuoteVideosFactory) {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_videos.html',
            restrict: 'E',
            replace: 'true',
            link: function postLink(scope, element, attrs) {
                var params = {
                    quoteServiceId: scope.quote_services
                };
                QuoteServiceQuoteVideosFactory.get(params, function(response) {
                    if (angular.isDefined(response.data)) {
                        scope.quote_service_videos = response.data;
                    } else {
                        scope.quote_service_videos = [];
                    }
                });
            }
        };
    })
    .directive('bindHtmlCompile', ['$compile', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(function() {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function(value) {
                    // Incase value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
}]);