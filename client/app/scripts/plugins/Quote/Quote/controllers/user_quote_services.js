'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:UserServicesController
 * @description
 * # UserServicesController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('UserServicesController', ['$window', '$rootScope', '$stateParams', '$state', 'flash', 'md5', '$filter', '$uibModal', '$location', '$scope', 'UsersFactory', function($window, $rootScope, $stateParams, $state, flash, md5, $filter, $uibModal, $location, $scope, UsersFactory) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Service Listings");
        var $ctrl = this;
        $ctrl.index = function() {
            $ctrl.loader = true;
            $scope.maxSize = 5;
            $scope.currentPage = ($stateParams.page !== undefined) ? parseInt($stateParams.page) : 1;
            var params = {};
            params.page = $scope.currentPage;
            params.is_have_service = 1;
            UsersFactory.get(params, function(response) {
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
                $ctrl.user_services = response.data;
                $ctrl.loader = false;
            });
        };
        $scope.$on('$locationChangeSuccess', function() {
            $scope.currentPage = ($stateParams.page !== undefined) ? parseInt($stateParams.page) : 1;
        });
        $ctrl.paginate_user_quote_services = function() {
            $location.search('page', parseInt($scope.currentPage));
        };
        $ctrl.index();
    }]);