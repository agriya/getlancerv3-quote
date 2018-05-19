'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteServiceCategoriesController
 * @description
 * # QuoteServiceCategoriesController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteServiceCategoriesController', ['$rootScope', '$scope', '$stateParams', 'flash', 'md5', '$filter', '$uibModal', '$location', 'QuoteServiceCategoriesFactory', function($rootScope, $scope, $stateParams, flash, md5, $filter, $uibModal, $location, QuoteServiceCategoriesFactory) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("All Services");
        $scope.index = function() {
            $scope.loader = true;
            var params = {};
            params.sort = 'name';
            params.sortby = 'ASC';
            params.display_type = 'hierarchical';
            params.limit = 'all';
            params.filter = 'active';
            $scope.quote_service_types = [];
            QuoteServiceCategoriesFactory.get(params, function(response) {
                angular.forEach(response.data, function(category) {
                        $scope.quote_service_types.push(category);
                });
                $scope.loader = false;
            });
        };
         $scope.openLoginModal = function(tabactive) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/login_modal.html',
                backdrop: 'static',
                controller: 'ModalLoginInstanceController',
                resolve: {
                    tabactive: function() {
                        return tabactive;
                    }
                }
            }); 
        };
        $scope.index();
    }]);