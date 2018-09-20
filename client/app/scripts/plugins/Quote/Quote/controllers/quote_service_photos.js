'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteServicePhotosManageController
 * @description
 * # QuoteServicePhotosManageController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteServicePhotosManageController', ['$window', '$rootScope', '$scope', '$stateParams', '$state', 'flash', 'md5', '$filter', '$uibModal', '$location', 'QuoteServiceFactory', 'QuoteServicePhotosFactory', 'QuoteServiceQuotePhotosFactory', 'QuoteServicePhotoFactory', 'Upload', '$timeout', function ($window, $rootScope, $scope, $stateParams, $state, flash, md5, $filter, $uibModal, $location, QuoteServiceFactory, QuoteServicePhotosFactory, QuoteServiceQuotePhotosFactory, QuoteServicePhotoFactory, Upload, $timeout) {
        var image = {};
        var url = $location.absUrl();
        if ($stateParams.quoteServiceId !== null) {
            $scope.url_split = $location.path().split("/")[1];
        }
        $scope.index = function () {
            $scope.loader = true;
            $scope.maxSize = 5;
            $scope.quoteServiceId = $stateParams.quoteServiceId;
            $scope.currentPage = ($stateParams.page !== undefined) ? parseInt($stateParams.page) : 1;
            var params = {};
            params.sort = 'id';
            params.sortby = 'desc';
            params.quoteServiceId = $stateParams.quoteServiceId;
            params.page = $scope.currentPage;
            QuoteServiceQuotePhotosFactory.get(params, function (response) {
                $scope.currentPage = params.page;
                if (angular.isDefined(response._metadata)) {
                    $scope.totalItems = response._metadata.total;
                    $scope.itemsPerPage = response._metadata.per_page;
                    $scope.noOfPages = response._metadata.last_page;
                }
                if (angular.isDefined(response.data)) {
                    angular.forEach(response.data, function (value) {
                        if (angular.isDefined(value) && value !== null) {
                            angular.forEach(value.attachment, function (newvalue) {
                                newvalue.image_name = $window.theme + 'images/no-image.png';
                                if (angular.isDefined(newvalue.id) && newvalue.foreign_id !== null) {
                                    var hash = md5.createHash(newvalue.class + newvalue.foreign_id + 'png' + 'medium_thumb');
                                    newvalue.image_name = 'images/medium_thumb/' + newvalue.class + '/' + newvalue.foreign_id + '.' + hash + '.png';
                                }
                            });
                        }
                    });
                }
                $scope.quote_service_photos = response.data;
                $scope.loader = false;
            });
            var paramsService = {};
            paramsService.quoteServiceId = $stateParams.quoteServiceId;
            //paramsService.fields = 'business_name';
            QuoteServiceFactory.get(paramsService, function (response) {
                $scope.quote_active = response.data.is_active;
                $scope.business_name = response.data.business_name;
                $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + ($scope.business_name) + ' ' + '-' + ' ' + $filter("translate")("Photos");
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
        $scope.QuotePhotoDelete = function (id) {
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
                            param.quoteServicePhotoId = id;
                            QuoteServicePhotoFactory.delete(param, function (response) {
                            $scope.response = response;
                                        if ($scope.response.error.code === 0) {
                                            $scope.index();
                                            flash.set($filter("translate")("Photo deleted successfully."), 'success', false);
                                        } else {
                                            flash.set($filter("translate")("Photo not be deleted. Try again later"), 'error', false);
                                        }
                                    });
                                }
                            });
        };
        $scope.uploadServicePhotos = function (file) {
            $scope.photo_btn = true;
            Upload.upload({
                url: '/api/v1/attachments?class=QuoteServicePhoto',
                data: {
                    file: file
                }
            })
                .then(function (response) {
                    if (response.data.error.code === 0) {
                        image['image'] = response.data.attachment;
                         $scope.error_message = '';
                         $scope.photo_btn = false;
                    } else {
                        $scope.error_message = response.data.error.message;
                        $scope.photo_btn = false;
                    }
                });
        };
        $scope.photo_btn = false;
        $scope.uploadFile = function (isvalid) {
            if (isvalid && !$scope.error_message) {
                $scope.photo_btn = true;
                image['quote_service_id'] = $scope.quoteServiceId;
                image['caption'] = $scope.caption;
                $scope.addimage = image;
                QuoteServicePhotosFactory.post($scope.addimage, function (response) {
                     if (response.error.code === 0) {
                    $state.reload();
                    $scope.ok();
                    flash.set($filter("translate")("Photo added successfully"), 'success', false);
                } else { 
                     flash.set($filter("translate")(response.error.message),'error', false);

                }
                });
            };
        };
        $scope.QuotePhotoAdd = function (id) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_photo_add.html',
                backdrop: 'static',
                controller: 'ModalInstanceController',
                resolve: { // This fires up before controller loads and templates rendered
                    quoteServiceId: function () {
                        return $scope.quoteServiceId;
                    }
                }
            });
        };
        $scope.QuotePhotoEdit = function (id) {
            var param = {};
            param.quoteServicePhotoId = id;
            QuoteServicePhotoFactory.get(param, function (response) {
                $scope.caption = response.data.caption;
                $scope.quoteServicePhotoId = response.data.id;
                $scope.modalInstance = $uibModal.open({
                    templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_photo_edit.html',
                    backdrop: 'static',
                    controller: 'ModalInstancePhotoEditController',
                    resolve: { // This fires up before controller loads and templates rendered
                        caption: function () {
                            return $scope.caption;
                        },
                        quoteServicePhotoId: function () {
                            return $scope.quoteServicePhotoId;
                        }
                    }
                });
            });
        };
        $scope.photo_edit = false;
        $scope.updateCaption = function (isvalid) {
            if (isvalid) {
                $scope.photo_edit = true;
                var param = {};
                param.quoteServicePhotoId = $scope.quoteServicePhotoId;
                param.caption = $scope.caption;
                QuoteServicePhotoFactory.put(param, function (response) {
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        $state.reload();
                        $scope.ok();
                        flash.set($filter("translate")("Photo caption updated successfully"), 'success', false);
                    } else {
                        $scope.ok();
                        flash.set($filter("translate")("Photo caption not updated. Try again later"), 'error', false);
                        $scope.photo_edit = false;
                    }
                });
            };
        };
        $scope.$on('$locationChangeSuccess', function () {
            $scope.currentPage = ($stateParams.page !== undefined) ? parseInt($stateParams.page) : 1;
        });
        $scope.paginate_photo = function () {
            $location.search('page', parseInt($scope.currentPage));
        };
        $scope.index();
    }]);
angular.module('getlancerApp.Quote')
    .controller('ModalInstanceController', function ($scope, $uibModalInstance, quoteServiceId) {
        $scope.quoteServiceId = quoteServiceId;
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    });
angular.module('getlancerApp.Quote')
    .controller('ModalInstancePhotoEditController', function ($scope, $uibModalInstance, caption, quoteServicePhotoId) {
        $scope.caption = caption;
        $scope.quoteServicePhotoId = quoteServicePhotoId;
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    });