'use strict';
/**
 * @ngdoc directive
 * @name getlancerApp.directive:QuoteServiceCategoryLists
 * @description
 * # QuoteServiceCategoryLists
 */
angular.module('getlancerApp')
    .directive('quoteServiceCategoryLists', function(QuoteServiceCategoriesFactory, md5, $window) {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_home_category.html',
            restrict: 'E',
            replace: 'true',
            link: function postLink(scope, element, attrs) {
                var params = {
                    limit: 4,
                    sort: 'name',
                    sortby: 'ASC',
                    is_featured: true,
                    display_type: 'parent',
                    filter: 'active',
                    field: 'id,name,slug,description'
                };
                QuoteServiceCategoriesFactory.get(params, function(response) {
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
                        scope.quote_service_categories = response.data;
                    }
                });
            }
        };
    })
    .directive('quoteHomeCategories', function(QuoteServiceCategoriesFactory, md5, $window) {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_home_categories.html',
            restrict: 'E',
            replace: 'true',
            link: function postLink(scope, element, attrs) {
                var params = {
                    limit: 8,
                    sort: 'name',
                    sortby: 'DSC',
                    is_featured: true,
                    display_type: 'parent',
                    filter: 'active',
                    field: 'id,name,slug,description'
                };
                scope.quote_home_categories = [];
                QuoteServiceCategoriesFactory.get(params, function(response) {
                    var temp_categories = [];
                    var i = 0;
                    angular.forEach(response.data, function(category) {
                        i++;
                        if (angular.isDefined(category) && category !== null) {
                            category.image_name = $window.theme + 'images/no-image.png';
                            if (angular.isDefined(category.attachment) && category.attachment !== null) {
                                var hash = md5.createHash(category.attachment.class + category.attachment.foreign_id + 'png' + 'medium_thumb');
                                category.image_name = 'images/medium_thumb/' + category.attachment.class + '/' + category.attachment.foreign_id + '.' + hash + '.png';
                            }
                        }
                        temp_categories.push(category);
                        if (temp_categories.length === 4 || i === response.data.length) {
                            scope.quote_home_categories.push(temp_categories);
                            temp_categories = [];
                        }
                    });
                });
            }
        };
    })
    .directive('quoteServiceFeaturedCategories', function(QuoteServiceCategoriesFactory) {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_footer_links.html',
            restrict: 'E',
            replace: 'true',
            link: function postLink(scope, element, attrs) {
                var params = {
                    limit: 5,
                    sort: 'name',
                    sortby: 'ASC',
                    display_type: 'parent',
                    is_featured: true,
                    field: 'id,name,slug,description'
                };
                QuoteServiceCategoriesFactory.get(params, function(response) {
                    if (angular.isDefined(response.data)) {
                        scope.footer_featured_categories = response.data;
                    }
                });
            }
        };
    });