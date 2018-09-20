'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteServicesController
 * @description
 * # QuoteServicesController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteServicesController', ['$window', '$rootScope', '$scope', '$stateParams', '$state', 'flash', 'md5', '$filter', '$uibModal', '$location', 'QuoteServicesFactory', 'userSettings', 'ConstServiceType', function($window, $rootScope, $scope, $stateParams, $state, flash, md5, $filter, $uibModal, $location, QuoteServicesFactory, userSettings, ConstServiceType) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Browse Services");
        $scope.quote_service_radius = {};
        if($rootScope.Freelancer !== true) {
             $scope.index = function() {
            $scope.loader = true;
            $scope.maxSize = 5;
            $scope.ConstServiceType = ConstServiceType;
            $scope.currentPage = ($stateParams.page !== undefined) ? parseInt($stateParams.page) : 1;
            $scope.radius = ($stateParams.radius !== undefined) ? parseInt($stateParams.radius) : "";
            var params = {};
            params.page = $scope.currentPage;
            params.q = $stateParams.q;
            if ($state.current.name === 'quote_services_filter' && $stateParams.user_id !== undefined) {
                params.user_id = $stateParams.user_id;
            }
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
        };
        }
        $scope.setRadius = function() {
            if ($scope.quote_service_radius.radius > 0) {
                $location.path('/quote_services/' + $scope.quote_service_radius.radius);
            } else {
                $scope.currentPage = 1;
                $location.path('/quote_services/');
            }
        };
        $scope.$on('$locationChangeSuccess', function() {
            $scope.currentPage = ($stateParams.page !== undefined) ? parseInt($stateParams.page) : 1;
        });
        $scope.paginate_quote_services = function() {
            $location.search('page', parseInt($scope.currentPage));
        };
        $scope.index();
    }]);