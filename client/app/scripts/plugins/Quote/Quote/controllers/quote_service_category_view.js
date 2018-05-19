'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteServiceCategoryServicesController
 * @description
 * # QuoteServiceCategoryServicesController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteServiceCategoryServicesController', ['$rootScope', '$scope', '$stateParams', 'flash', 'md5', '$filter', '$uibModal', '$location', 'QuoteServicesFactory', 'QuoteServiceCategoriesFactory', '$window', function($rootScope, $scope, $stateParams, flash, md5, $filter, $uibModal, $location, QuoteServicesFactory, QuoteServiceCategoriesFactory, $window) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Quote Service Types");
        $scope.index = function() {
            $scope.loader = true;
            $scope.maxSize = 5;
            $scope.currentPage = ($stateParams.page !== undefined) ? parseInt($stateParams.page) : 1;
            var params = {
                'categories[]': $stateParams.id
            };
            params.sort = 'id';
            params.page = $scope.currentPage;
            QuoteServicesFactory.get(params, function(response) {
                $scope.currentPage = params.page;
                if (angular.isDefined(response._metadata)) {
                    $scope.totalItems = response._metadata.total;
                    $scope.itemsPerPage = response._metadata.per_page;
                    $scope.noOfPages = response._metadata.last_page;
                }
                angular.forEach(response.data, function(value) {
                    if (angular.isDefined(value) && value !== null) {
                        value.image_name = $window.theme + 'images/no-image.png';
                        if (angular.isDefined(value.attachment) && value.attachment !== null) {
                            var hash = md5.createHash(value.attachment.class + value.attachment.foreign_id + 'png' + 'normal_thumb');
                            value.image_name = 'images/normal_thumb/' + value.attachment.class + '/' + value.attachment.foreign_id + '.' + hash + '.png';
                        }
                    }
                });
                $scope.quote_services = response.data;
                $scope.loader = false;
            });
            var paramsService = {};
            paramsService.quoteCategoryId = $stateParams.id;
            paramsService.fields = 'name';
            QuoteServiceCategoriesFactory.get(paramsService, function(response) {
                $scope.quote_services_category_name = response.data.name;
            });
        };
        $scope.$on('$locationChangeSuccess', function() {
            $scope.currentPage = ($stateParams.page !== undefined) ? parseInt($stateParams.page) : 1;
        });
        $scope.paginate = function() {
            $location.search('page', parseInt($scope.currentPage));
        };
        $scope.index();
    }]);