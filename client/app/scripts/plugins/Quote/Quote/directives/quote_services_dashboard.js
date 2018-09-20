'use strict';
/**
 * @ngdoc directive
 * @name getlancerApp.directive:quoteServicesMyServicesDashboard
 * @description
 * # quoteServicesMyServicesDashboard
 */
angular.module('getlancerApp')
    .directive('quoteServicesMyServicesDashboard', function() {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_my_services_dashboard.html',
            restrict: 'E',
            replace: 'true',
            controller: 'quoteServicesMyServicesDashboardCtrl'
        };
    })
    
    .controller('quoteServicesMyServicesDashboardCtrl', function($rootScope, $scope, QuoteServicesMeFactory, md5, $window, QuoteServicesStatusFactory, QuoteServiceFactory, $filter, flash, $state, Slug) { 
        $scope.my_services = true;
        //  $scope.quote_services_user = [];
        $scope.pageChangedService = function(page) {
            $scope.currentPageService = page;
            $scope.my_services = true;
            $scope.getMyServices();
        };
        function createSlug(input) {
            return Slug.slugify(input);
        }
       $scope.getServiceCount = function() {  
        QuoteServicesStatusFactory.get(function(response){
            $scope.quote_service_count = response.data;

        });
       };
        $scope.getMyServices = function() {
            $scope.loader = true;
            if ($scope.my_services) {
                $scope.maxSize = 5;
                var params = {};
                params.userId = $rootScope.user.id;
                params.page = $scope.currentPageService;
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
                // params.fields = 'business_name,id,quote_service_photo_count,quote_service_video_count,quote_service_audio_count,quote_faq_answer_count,quote_bid_new_count,under_discussion_count,hired_count,completed_count,full_address, is_active, is_admin_suspend';
                
                  QuoteServicesMeFactory.get(params, function(response) {
                    $scope.loader = false;
                    $scope.currentPageService = params.page;
                    if (angular.isDefined(response._metadata)) {
                        $scope.totalItems = response._metadata.total;
                        $scope.itemsPerPage = response._metadata.per_page;
                        $scope.noOfPages = response._metadata.last_page;
                        $scope.currentpage = response._metadata.current_page;
                        $scope.lastpage = response._metadata.last_page;
                    }
                     if (angular.isDefined(response.data)) {
                    //        var temp_photos = [];
                    // var i = 0;
                    angular.forEach(response.data, function(quote_service) {
                    //  i++;
                    if (angular.isDefined(quote_service) && quote_service !== null) {
                       quote_service.image_name = $window.theme + 'images/no-image.png';
                            if (angular.isDefined(quote_service.attachment) && quote_service.attachment !== null) {
                                var hash = md5.createHash(quote_service.attachment.class + quote_service.attachment.foreign_id + 'png' + 'large_thumb');
                                quote_service.image_name = 'images/large_thumb/' + quote_service.attachment.class + '/' + quote_service.attachment.foreign_id + '.' + hash + '.png';
                            }
                        }
                    // temp_photos.push(quote_service);
                    //     if (temp_photos.length === 4 || i === response.data.length) {
                    //         $scope.quote_services_user.push(temp_photos);
                    //         temp_photos = [];
                         
                    //     }
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
        $scope.loadMore = function() {
            $scope.currentPageService += 1;
            $scope.getMyServices();
        };
          $scope.setQuoteServiceStatus = function(data, name) {
           name = (name) ? name : $rootScope.Stats;
           data = (data) ? data : $rootScope.data_name;
           $scope.my_services = true;
           $scope.getStatus = data;
           $scope.getMyServices();  
            $scope.my_request_name = name;
            $state.go('user_dashboard', {
                status: createSlug(name),
                type: 'my_service_active'
            }, {
                notify: false
            });
        };
         if ($state.params.status) {
             $rootScope.Stats = $state.params.status;
            if ($state.params.status === 'all') {
                $scope.setQuoteServiceStatus('All', 'all');
              $rootScope.data_name  = 'All';
            }
            else if ($state.params.status === 'active') {
                $scope.setQuoteServiceStatus('Active', 'active');
                 $rootScope.data_name  = 'Active';
            } else if ($state.params.status === 'draftdisabled') {
                  $rootScope.data_name  = 'Draft/Disabled';
                $scope.setQuoteServiceStatus('Draft/Disabled' ,'draftdisabled');
            } 
        }


      //  $scope.getMyServices();
        $scope.getServiceCount();
        $scope.setQuoteServiceStatus();
    })
    .directive('quoteServicesMyWorkDashboard', function() {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_my_works_dashboard.html',
            restrict: 'E',
            replace: 'true',
            controller: 'quoteServicesMyWorkDashboardCtrl'
        };
    })
    .controller('quoteServicesMyWorkDashboardCtrl', function($rootScope, ServiceProvidersQuoteBidsFactory, md5, $window, $scope, ConstQuoteStatuses, $state) {
        $scope.my_work = true;
        $scope.getMyWorks = function() {
            $scope.loader = true;
            if ($scope.my_work) {
                var user_params = {};
                user_params.serviceProviderUserId = $rootScope.user.id;
                //  user_params.page = $scope.loadPage;
                user_params.sort = 'updated_at';
                user_params.sortby = 'DESC';
                ServiceProvidersQuoteBidsFactory.get(user_params, function(response) {
                    $scope.loader = false;
                    $scope.quote_my_works = response.data;
                    $scope.my_work = false;
                });
            }
        };
        $scope.quote_status_change = function(quote_status_id)
        {
        if(quote_status_id === ConstQuoteStatuses.New)
            {
              $state.go('quote_my_works_filter', {
                status: quote_status_id,
                statusname: 'new'
            })
            } else if(quote_status_id === ConstQuoteStatuses.UnderDiscussion){
              $state.go('quote_my_works_filter', {
                status: quote_status_id,
                statusname: 'under_discussion'
            })
            } else if(quote_status_id === ConstQuoteStatuses.Hired)
            {
                $state.go('quote_my_works_filter', {
                status: quote_status_id,
                statusname: 'hired'
            })
            }else if(quote_status_id === ConstQuoteStatuses.completed)
            {
               $state.go('quote_my_works_filter', {
                status: quote_status_id,
                statusname: 'completed'
              }) 
            }else if(quote_status_id === ConstQuoteStatuses.NotInterested)
            {
               $state.go('quote_my_works_filter', {
                status: quote_status_id,
                statusname: 'not_interested'
              }) 
            }
            else if(quote_status_id === ConstQuoteStatuses.Closed)
            {
               $state.go('quote_my_works_filter', {
                status: quote_status_id,
                statusname: 'not_interested'
              }) 
            }else{}
        };
        $scope.getMyWorks();
    })
    .directive('quoteServicesMyRequestDashboard', function() {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_my_requests_dashboard.html',
            restrict: 'E',
            replace: 'true',
            controller: 'quoteServicesMyRequestDashboardCtrl'
        };
    })
    .controller('quoteServicesMyRequestDashboardCtrl', function($rootScope, QuoteRequestUserFactory, md5, $window, ConstType, ConstQuoteStatuses, $scope, $state, QuoteRequestStatusFactory, QuoteRequestFactory,$filter, flash, Slug) {
        $scope.ConstType = ConstType;
        $scope.ConstQuoteStatuses = ConstQuoteStatuses;
        $scope.my_request = true;
        $scope.currentPage = 1;
        $scope.getMyRequest = function() {
            $scope.loader = true;
            if ($scope.my_request) {
                var params = {};
                params.userId = $rootScope.user.id;
                params.page = $scope.currentPage;
                params.sort = 'updated_at';
                params.sortby = 'DESC';
                params.fields = 'id,title,quote_bid_new_count,quote_bid_discussion_count,quote_bid_hired_count,quote_bid_completed_count,updated_at,is_request_for_buy,quote_category_id,is_archived,quote_bid_closed_count,quote_bid_not_completed_count';
                if ($scope.is_archived == undefined) {
                    params.is_archived = undefined;
                }
                else if ($scope.is_archived == $scope.ConstType.Archived) {
                    params.is_archived = $scope.is_archived;
                }
                else if ($scope.is_archived === 0) {
                    params.is_archived = 0;
                }
                QuoteRequestUserFactory.get(params, function(response) {
                    $scope.loader = false;
                    $scope.currentPage = params.page;
                    if (angular.isDefined(response._metadata)) {
                        $scope.totalItems = response._metadata.total;
                        $scope.itemsPerPage = response._metadata.per_page;
                        $scope.noOfPages = response._metadata.last_page;
                    }
                    $scope.my_request = false;
                    $scope.quote_request_user = response.data;
                });
            }
        };
  var flashMessage ={};
          $scope.setArchived = function(archiveid) {
            if ($rootScope.user !== null && $rootScope.user !== undefined) {
                swal({ //jshint ignore:line
                    title: $filter("translate")("Are you sure you want to archive this request?"),
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
                        params.quoteRequestId = archiveid;
                        params.is_archived = true;
                        QuoteRequestFactory.put(params, function(response) {
                            if (response.error.code === 0) {
                                 $state.reload();
                                 $scope.getMyRequest();
                                flashMessage = $filter("translate")("Request archived successfully.");
                                flash.set(flashMessage, 'success', false);
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

         $scope.setUnArchived = function(archiveid) {
            if ($rootScope.user !== null && $rootScope.user !== undefined) {
                swal({ //jshint ignore:line
                    title: $filter("translate")("Are you sure you want to Unarchive this request?"),
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
                        params.quoteRequestId = archiveid;
                        params.is_archived = false;
                        QuoteRequestFactory.put(params, function(response) {
                            if (response.error.code === 0) {
                                 $state.reload();
                                 $scope.getMyRequest();
                                flashMessage = $filter("translate")("Request Unarchived successfully.");
                                flash.set(flashMessage, 'success', false);
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

          $scope.setQuoteRequestStatus = function() {
                QuoteRequestStatusFactory.get(function(response) {
                    $scope.quote_request_status_count = response.data;
                });
            };
       $scope.setQuoteRequestStatus(); 
        $scope.getMyRequest();
        $scope.my_services = true;
        $scope.pageChanged = function(page) {
            $scope.currentPage = page;
            $scope.my_request = true;
            $scope.getMyRequest();
        };
        $scope.set_request = false;
        $scope.setRequestFilter = function(data, name) {
            $scope.request_status = data;
            $scope.set_request = true;
             if (data == null) {
                 $scope.is_archived = undefined;
            }
            if (data == 'ConstType.Archived') {
                $scope.is_archived = $scope.ConstType.Archived;
            }
            if (data == 'ConstType.open') {
                $scope.is_archived = 0;
            }
            //   $scope.is_archived = '';
            $scope.my_request = true;
            $scope.getMyRequest();
            $scope.my_request_name = name;
            $state.go('user_dashboard', {
                status: name,
                type: 'requests'
            }, {
                notify: false
            });
          
        };
        if ($state.params.status) {
            if ($state.params.status === 'All') {
                $scope.setRequestFilter(null, 'all');
            }
            else if ($state.params.status === 'Open') {
                $scope.setRequestFilter('ConstType.open', 'Open');
            } else if ($state.params.status === 'Archived') {
                $scope.setRequestFilter('ConstType.Archived','Archived');
            }
        }

        //if (attrs.active === 'true') {
        $scope.getMyRequest();
        //}
    })
    .directive('quoteDashboarWorkAction', function() {
        return {
            restrict: 'EA',
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_dasboard_work_action.html',
            scope: {
                quoteid: '@',
            },
            /* controller: 'quoteWorkDashboardCtrl'*/
            // controller: function ($rootScope, $scope, $filter, ProjectStatusConstant) {
            //   $scope.ProjectStatusConstant = ProjectStatusConstant;
            // }      
        }
    })