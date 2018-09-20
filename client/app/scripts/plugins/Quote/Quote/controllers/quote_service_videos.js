'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.Quote.controller:QuoteServiceVideosManageController
 * @description
 * # QuoteServiceVideosManageController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteServiceVideosManageController', ['$window', '$rootScope', '$scope', '$http', '$stateParams', '$state', 'flash', 'md5', '$filter', '$uibModal', '$location', 'QuoteServiceFactory', 'QuoteServiceVideosFactory', 'QuoteServiceVideoFactory', 'QuoteServiceQuoteVideosFactory','$timeout', function($window, $rootScope, $scope, $http, $stateParams, $state, flash, md5, $filter, $uibModal, $location, QuoteServiceFactory, QuoteServiceVideosFactory, QuoteServiceVideoFactory, QuoteServiceQuoteVideosFactory, $timeout) {
         var url = $location.absUrl();
        if ($stateParams.quoteServiceId !== null) {
            $scope.url_split = $location.path().split("/")[1];
        }
        $scope.index = function() {
            $scope.loader = true;
            $scope.maxSize = 5;
            $scope.quoteServiceId = $stateParams.quoteServiceId;
            $scope.currentPage = ($stateParams.page !== undefined) ? parseInt($stateParams.page) : 1;
            var params = {};
            params.sort = 'id';
            params.sortby = 'desc';
            params.quoteServiceId = $stateParams.quoteServiceId;
            params.page = $scope.currentPage;
            QuoteServiceQuoteVideosFactory.get(params, function(response) {
                $scope.currentPage = params.page;
                if (angular.isDefined(response._metadata)) {
                    $scope.totalItems = response._metadata.total;
                    $scope.itemsPerPage = response._metadata.per_page;
                    $scope.noOfPages = response._metadata.last_page;
                }
                $scope.quote_service_videos = response.data;
                $scope.loader = false;
            });
            var paramsService = {};
            paramsService.quoteServiceId = $stateParams.quoteServiceId;
           // paramsService.fields = 'business_name';
            QuoteServiceFactory.get(paramsService, function(response) {
                $scope.business_name = response.data.business_name;
                 $scope.quote_active = response.data.is_active;
                $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' +  ($scope.business_name) + ' ' + '-' + ' ' + $filter("translate") ("Videos");
            });
              $scope.setQuoteActive = function (){
                     var flashMessage = "";
                    swal({ //jshint ignore:line
                        title: $filter("translate")("Are you sure you want to active this service?"),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: true,
                        animation:false,
                    }).then(function (isConfirm) {
                        if (isConfirm) {
                            var params = {};
                             params.is_active = 1;
                             params.quoteServiceId = $stateParams.quoteServiceId;
                           QuoteServiceFactory.put(params, function(response){
                                if (response.error.code === 0){
                        flash.set($filter("translate")("Service activated successfully."), 'success', false);
                     $timeout(function() {
                         $state.reload();
                    },100);
                        } else {
                                    flashMessage = $filter("translate")(response.error.message);
                                    flash.set(flashMessage, 'error', false);
                                }
                               
                            });
                        }
                    });
          };
        };
        $scope.QuoteVideoDelete = function(id) {
                var flashMessage = "";
                    swal({ //jshint ignore:line
                        title: $filter("translate")("Are you sure you want to delete?"),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: true,
                        animation:false,
                    }).then(function (isConfirm) {
                        if (isConfirm) {
                            var param = {};
                              param.quoteServiceVideoId = id;
                            QuoteServiceVideoFactory.delete(param, function(response) {
                                $scope.response = response;
                                if ($scope.response.error.code === 0) {
                                    $scope.index();
                                    flash.set($filter("translate")("Deleted successfully"), 'success', false);
                                    $timeout(function() {
                                      $state.reload();
                                     },100);
                                } else {
                                    flashMessage = $filter("translate")(response.error.message);
                                    flash.set(flashMessage, 'error', false);
                                }
                            });
                        }
                    });
        };
        $scope.save_btn = false;
        $scope.add = function(isvalid) {
            if (isvalid) {
                $scope.save_btn = true;
                var param = {};
                param.quote_service_id = $scope.quoteServiceId;
                param.video_url = $scope.embed_code;
                QuoteServiceVideosFactory.post(param, function(response) {
                    $scope.save_btn = false;
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        $state.reload();
                        $scope.ok();
                        flash.set($filter("translate")("Video Added successfully"), 'success', false);
                        $scope.save_btn = false;
                    } else {
                        $scope.ok();
                        flash.set($filter("translate")("Video could not be added. Please, try again"), 'error', false);
                        $scope.save_btn = false;
                    }
                },function(error) {
                    flash.set($filter("translate")("Video could not be added. Please, try again"), 'error', false);
                     $scope.save_btn = false;
                });
            };
        }
        $scope.update = function() {
            var param = {};
            param.quoteServiceVideoId = $scope.quoteServiceVideoId;
            param.video_url = $scope.embed_code;
            QuoteServiceVideoFactory.put(param, function(response) {
                $scope.response = response;
                if ($scope.response.error.code === 0) {
                    $state.reload();
                    $scope.ok();
                    flash.set($filter("translate")("Updated successfully"), 'success', false);
                } else {
                    $scope.ok();
                    flash.set($filter("translate")("Could not be Updated"), 'error', false);
                }
            });
        };
        $scope.QuoteVideoEdit = function(id) {
            var param = {};
            param.quoteServiceVideoId = id;
            QuoteServiceVideoFactory.get(param, function(response) {
                $scope.embed_code = response.data.embed_code;
                $scope.quoteServiceVideoId = response.data.id;
                $scope.modalInstance = $uibModal.open({
                    templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_video_edit.html',
                    backdrop: 'static',
                    controller: 'ModalVideoController',
                    resolve: { // This fires up before controller loads and templates rendered
                        embed_code: function() {
                            return $scope.embed_code;
                        },
                        quoteServiceVideoId: function() {
                            return $scope.quoteServiceVideoId;
                        }
                    }
                });
            });
        };
        $scope.QuoteVideoAdd = function(id) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_video_add.html',
                backdrop: 'static',
                controller: 'ModalVideoController',
                resolve: { // This fires up before controller loads and templates rendered
                    embed_code: function() {
                        return $scope.embed_code;
                    },
                    quoteServiceVideoId: function() {
                        return $scope.quoteServiceVideoId;
                    }
                }
            });
        };
        $scope.$on('$locationChangeSuccess', function() {
            $scope.currentPage = ($stateParams.page !== undefined) ? parseInt($stateParams.page) : 1;
        });
        $scope.paginate_video = function() {
            $location.search('page', parseInt($scope.currentPage));
        };
        $scope.index();
    }]);
angular.module('getlancerApp.Quote')
    .controller('ModalVideoController', function($scope, $uibModalInstance, embed_code, quoteServiceVideoId) {
        $scope.embed_code = embed_code;
        $scope.quoteServiceVideoId = quoteServiceVideoId;
        $scope.ok = function() {
            $uibModalInstance.close();
        };
    });