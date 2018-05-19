'use strict';
/**
 * @ngdoc Controller
 * @name getlancerApp.Quote.Controller:quoteMyServicesCtrl
 * @description
 * # quoteMyServicesCtrl
 */
angular.module('getlancerApp.Quote')
    .controller('quoteMyServicesCtrl', function($rootScope, $scope, QuoteServicesMeFactory, md5, $window, QuoteServicesStatusFactory, QuoteServiceFactory, $filter, flash, SweetAlert, $state, Slug) { 
        $scope.my_services = true;
         $scope.quote_services_user = [];
         $scope.index= function(){
             $scope.getMyServices();
         }
        $scope.pageChangedService = function(page) {
            $scope.currentPageService = page;
            $scope.my_services = true;
            $scope.getMyServices();
        };
        function createSlug(input) {
            return Slug.slugify(input);
        }
        $scope.getMyServices = function() {
            $scope.loader = true;
            if ($scope.my_services) {
                $scope.maxSize = 5;
                var params = {};
                params.userId = $rootScope.user.id;
            /*    params.page = $scope.currentPageService;*/
                if($scope.getStatus === undefined){
                    params.filter = 'all';
                }
                else if ($scope.getStatus == 'All'){
                    params.filter = 'all';
                }
                else if ($scope.getStatus == 'Active'){
                    params.filter = 'active';
                }
                else if ($scope.getStatus == 'Draft/Disabled'){
                    params.filter = 'inactive';
                }
                if($state.params.page === undefined)
                {
                    params.page = 1;
                }else{
                    params.page = $state.params.page;
                } 
                // params.fields = 'business_name,id,quote_service_photo_count,quote_service_video_count,quote_service_audio_count,quote_faq_answer_count,quote_bid_new_count,under_discussion_count,hired_count,completed_count,full_address, is_active, is_admin_suspend';
                if($state.params.q !== 'undefined')
                {
                    params.q = $state.params.q;
                }
                  QuoteServicesMeFactory.get(params, function(response) {
                    $scope.loader = false;
                    $scope.currentPageService = params.page;
                    if (angular.isDefined(response._metadata)) {
                        $scope.totalItems = response._metadata.total;
                        $scope.itemsPerPage = response._metadata.per_page;
                        $scope.noOfPages = response._metadata.last_page;
                        $scope.currentPages = response._metadata.current_page;
                        $scope.lastpage = response._metadata.last_page;
                    }
                     if (angular.isDefined(response.data)) {
                           var temp_photos = [];
                    var i = 0;
                    angular.forEach(response.data, function(quote_service) {
                     i++;
                    if (angular.isDefined(quote_service) && quote_service !== null) {
                       quote_service.image_name = $window.theme + 'images/no-image.png';
                            if (angular.isDefined(quote_service.attachment) && quote_service.attachment !== null) {
                                var hash = md5.createHash(quote_service.attachment.class + quote_service.attachment.foreign_id + 'png' + 'large_thumb');
                                quote_service.image_name = 'images/large_thumb/' + quote_service.attachment.class + '/' + quote_service.attachment.foreign_id + '.' + hash + '.png';
                            }
                        }
                    temp_photos.push(quote_service);
                        if (temp_photos.length === 4 || i === response.data.length) {
                            $scope.quote_services_user.push(temp_photos);
                            temp_photos = [];
                         
                        }
                    });
                     }
                    $scope.my_services = false;

                });

                if($state.params.type === 'my_service_active')
                {
                  params.sort = 'updated_at';
                  params.sortby = 'DESC';
                       QuoteServicesMeFactory.get(params, function(response) {
                    $scope.loader = false;
                    $scope.currentPageService = params.page;
                    if (angular.isDefined(response._metadata)) {
                        $scope.totalItems = response._metadata.total;
                        $scope.itemsPerPage = response._metadata.per_page;
                        $scope.noOfPages = response._metadata.last_page;
                    }
                    angular.forEach(response.data, function(value) {
                        if (angular.isDefined(value) && value !== null) {
                            value.image_name = $window.theme + 'images/no-image.png';
                            if (angular.isDefined(value.attachment) && value.attachment !== null) {
                                var hash = md5.createHash(value.attachment.class + value.attachment.foreign_id + 'png' + 'small_thumb');
                                value.image_name = 'images/small_thumb/' + value.attachment.class + '/' + value.attachment.foreign_id + '.' + hash + '.png';
                            }
                        }
                    });
                    $scope.quote_services_user = response.data;
                    $scope.my_services = false;
                });
                }
            }
        };

     /*delete service */
        var flashMessage ={};
           $scope.deleteService = function(serviceid) {
            if ($rootScope.user !== null && $rootScope.user !== undefined) {
                SweetAlert.swal({
                    title: $filter("translate")("Are you sure you want to delete?"),
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: true,
                    animation:false,
                }, function(isConfirm) {
                    if (isConfirm) {
                        var params = {};
                        params.quoteServiceId = serviceid;
                        QuoteServiceFactory.delete(params, function(response) {
                            if (response.error.code === 0) {
                                flashMessage = $filter("translate")("Service deleted successfully.");
                                flash.set(flashMessage, 'success', false);
                               $state.reload();
                            } else {
                                flashMessage = $filter("translate")(response.error.message);
                                flash.set(flashMessage, 'error', false);
                                $state.reload();
                            }
                        });
                    }
                });
            }
        };
      /* loadmore for reviews  */
       /* $scope.loadMore = function() {
            alert('check');
            $scope.currentPageService += 1;
            $scope.getMyServices();
        };*/
         $scope.paginate = function() {
            $scope.currentPages = parseInt($scope.currentPages);
             $state.go('quote_my_services', {
                    'page': $scope.currentPages,
                });
            $scope.getMyServices();
        };
        $scope.index();
    });
