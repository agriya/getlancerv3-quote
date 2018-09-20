'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteRequestViewController
 * @description
 * # QuoteRequestViewController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteRequestViewController', ['$window', '$rootScope', '$scope', '$http', '$stateParams', '$state', 'flash', 'md5', '$filter', '$uibModal', '$uibModalStack', '$location', 'QuoteRequestQuoteBidsFactory', 'QuoteServiceFactory', 'moment', 'ConstQuoteStatuses', 'QuoteServiceFaqAnswersFactory', 'MessagesFactory', 'QuoteBidFactory', 'ConstPayToEscrow', 'ConstQuoteBuyOption', 'anchorSmoothScroll', 'QuoteServiceQuotePhotosFactory', 'QuoteServiceQuoteVideosFactory', 'QuoteMeRequestsFactory', function ($window, $rootScope, $scope, $http, $stateParams, $state, flash, md5, $filter, $uibModal, $uibModalStack, $location, QuoteRequestQuoteBidsFactory, QuoteServiceFactory, moment, ConstQuoteStatuses, QuoteServiceFaqAnswersFactory, MessagesFactory, QuoteBidFactory, ConstPayToEscrow, ConstQuoteBuyOption, anchorSmoothScroll, QuoteServiceQuotePhotosFactory, QuoteServiceQuoteVideosFactory, QuoteMeRequestsFactory) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("My Requests");
        $scope.loadPage = 1;
        $scope.MessagePage = 1;
        $scope.conversation = {};
        $rootScope.requestorId = $stateParams.requestId;
        $scope.quote_request_views = [];
        $scope.conversation = {};
        $scope.status = 0;
        $scope.ConstQuoteStatuses = ConstQuoteStatuses;
        $scope.ConstPayToEscrow = ConstPayToEscrow;
        $scope.ConstQuoteBuyOption = ConstQuoteBuyOption;
        $scope.index = function () {
            $scope.getMyRequest();
            $scope.loader = true;
            var user_params = {};
            var title;
            user_params.requestorId = $rootScope.user.id;
            if ($stateParams.status != undefined) {
                  if(parseInt($stateParams.status) ===  $scope.ConstQuoteStatuses.Closed)
                {
                    user_params.quote_bid_status_id = $scope.ConstQuoteStatuses.Closed + ',' + $scope.ConstQuoteStatuses.NotCompleted;
                }else if(parseInt($stateParams.status) ===  $scope.ConstQuoteStatuses.UnderDiscussion)
                {
                     user_params.quote_bid_status_id = $scope.ConstQuoteStatuses.New + ',' + $scope.ConstQuoteStatuses.UnderDiscussion;
                }else{
                     user_params.quote_bid_status_id = $stateParams.status;
                }
            }
            if ($scope.requestorId != 'all') {
                user_params.quote_request_id = $scope.requestorId;
            }
            if (($stateParams.type == 'sales') && ($stateParams.type !== undefined) && ($rootScope.settings.IS_BUY_OPTION_ENABLED == $rootScope.ConstQuoteBuyOption.Enabled)) {
                $scope.quote_type = true;
                title = "My Requests for Sales";
            } else {
                $scope.quote_type = false;
                title = "My Requests";
            }
            /*For search function*/
            var params = {};
            params.fields = 'id' + ',' + 'title';
            params.is_archived = 0;
            if($stateParams.requestId !== 'all')
            {
            QuoteMeRequestsFactory.get(params, function (response) {
                $scope.myRequests = response.data;
                  angular.forEach($scope.myRequests, function (value) {
                    if (value.id === parseInt($stateParams.requestId)) {
                        $scope.request_filter = value;
                    }
                });
                
            });
            }else{
               $scope.request_filter = false; 
            }
            user_params.page = $scope.loadPage;
            QuoteRequestQuoteBidsFactory.get(user_params, function (response) {
                $scope.loader = false;
                if (angular.isDefined(response._metadata)) {
                    $scope.noOfPagesRequest = response._metadata.last_page;
                }
                if (angular.isDefined(response.data)) {
                    if (response.data.length !== 0) {
                        angular.forEach(response.data, function (value) {
                            if (angular.isDefined(value) && value !== null) {
                                if (angular.isDefined(value.attachment) && value.attachment !== null) {
                                    var hash = md5.createHash(value.attachment.class + value.attachment.foreign_id + 'png' + 'medium_thumb');
                                    value.image_name = 'images/medium_thumb/' + value.attachment.class + '/' + value.attachment.foreign_id + '.' + hash + '.png';
                                } else {
                                    value.image_name = $window.theme + 'images/default.png';
                                }
                            }
                            $scope.quote_request_views.push(value);
                        });
                        if ($scope.quote_request_views.length) {
                            if ($stateParams.id === undefined) {
                                $scope.getBidDetails($scope.quote_request_views[0].id);
                            } else {
                                $scope.getBidDetails($stateParams.id);
                            }
                        }
                        $scope.quoteCatagoryShow = true;
                        $rootScope.quote_category_name = $scope.quote_request_views[0].quote_request.quote_category.name;
                    }
                }
            });
            if ($stateParams.status != undefined) {
                if(parseInt($stateParams.status) ===  $scope.ConstQuoteStatuses.Closed)
                {
                    user_params.quote_bid_status_id = $scope.ConstQuoteStatuses.Closed + ',' + $scope.ConstQuoteStatuses.NotCompleted;
                }else if(parseInt($stateParams.status) ===  $scope.ConstQuoteStatuses.UnderDiscussion)
                {
                     user_params.quote_bid_status_id = $scope.ConstQuoteStatuses.New + ',' + $scope.ConstQuoteStatuses.UnderDiscussion;
                }else{
                     user_params.quote_bid_status_id = $stateParams.status;
                }
                user_params.quote_request_id = $stateParams.id;
                $scope.status = $stateParams.status;
                var statues_name = $stateParams.statusname;
                statues_name = statues_name.replace(/_/g, " ");
                title = title + ' - ' + $rootScope.quote_category_name + ' - ' + statues_name.charAt(0)
                    .toUpperCase() + statues_name.slice(1);
            }
        };

        /*  user quote Requests get method */
        $scope.getMyRequest = function () {
            var params = {};
            params.fields = 'id' + ',' + 'title';
            params.is_archived = 0;
            QuoteMeRequestsFactory.get(params, function (response) {
                $scope.myRequests = response.data;
            });
        };
        $scope.myRequest = {};
        /* For search select pre-fill*/
        $scope.searchRequest = function (requestid, type) {
            if (type !== 'All') {
                angular.forEach($scope.myRequests, function (value) {
                    if (value.id === requestid) {
                        $scope.request_filter = value;
                    }
                });
            if($stateParams.status === undefined && $stateParams.statusname === undefined){
                $state.go('quote_request_user_view',
                    {
                        requestId: requestid
                    });
            }
              else {
              $state.go('quote_request_user_view_filter',
              {
                      requestId : requestid,
                      status : $stateParams.status,
                      statusname : $stateParams.statusname,             
                  });
            }
            }
        else {
        $scope.request_filter = false;
        if($stateParams.status === undefined && $stateParams.statusname === undefined){
                $state.go('quote_request_user_view',
                    {
                        requestId: requestid
                    });
            }
              else {
              $state.go('quote_request_user_view_filter',
              {
                      requestId : requestid,
                      status : $stateParams.status,
                      statusname : $stateParams.statusname,             
                  });
            }
            }
        };
        $scope.index();
        $scope.getBidDetail = function (id) {
            $scope.quodeid = id;
            if ($stateParams.requestId !== undefined && $stateParams.status === undefined && $stateParams.statusname === undefined) {
                $state.go('quote_request_user_view_change',
                    {
                        requestId: $stateParams.requestId,
                        id: $scope.quodeid,
                    });
            } else {
                $state.go('quote_request_user_view_filter_change',
                    {
                        requestId: $stateParams.requestId,
                        status: $stateParams.status,
                        statusname: $stateParams.statusname,
                        id: $scope.quodeid,
                    });
            }
        }
        $scope.getBidDetails = function (id) {
            $scope.quote_request_views_messages = [];
            var found = $filter('filter')($scope.quote_request_views, {
                id: parseInt(id)
            }, true);
            if (found.length) {
                $scope.quote_request_views_detail = {};
                $scope.quote_request_views_detail = found[0];
                if (angular.isDefined($scope.quote_request_views_detail.service_provider_user.attachment) && $scope.quote_request_views_detail.service_provider_user.attachment !== null) {
                    var hash = md5.createHash($scope.quote_request_views_detail.service_provider_user.attachment.class + $scope.quote_request_views_detail.service_provider_user.attachment.foreign_id + 'png' + 'normal_thumb');
                    $scope.quote_request_views_detail.image_name = 'images/normal_thumb/' + $scope.quote_request_views_detail.service_provider_user.attachment.class + '/' + $scope.quote_request_views_detail.service_provider_user.attachment.foreign_id + '.' + hash + '.png';
                } else {
                    $scope.quote_request_views_detail.image_name = $window.theme + 'images/default.png';
                }
                $scope.getQuoteServicePhotos($scope.quote_request_views_detail.quote_service.id);
                $scope.getQuoteServiceVideos($scope.quote_request_views_detail.quote_service.id);
                // $scope.getQuoteServiceAudios($scope.quote_request_views_detail.quote_service.id);
                $scope.getQuoteServiceFAQs($scope.quote_request_views_detail.quote_service.id);
                $scope.getMessages();
                $scope.setAsRequestRead(id);
                found[0].is_requestor_readed = true;
            }
        }
        $scope.setAsRequestRead = function (id) {
            var params = {};
            params.quoteBidId = id;
            params.is_requestor_readed = 1;
            QuoteBidFactory.put(params);
        };
        /*  Status name for display - Begin*/
        if ($stateParams.statusname === 'new') {
            $scope.QuoteStatusName = 'New';
        } else if ($stateParams.statusname === 'under_discussion') {
            $scope.QuoteStatusName = 'Under Discussion';
        } else if ($stateParams.statusname === 'hired') {
            $scope.QuoteStatusName = 'Hired';
        } else if ($stateParams.statusname === 'not_interested') {
            $scope.QuoteStatusName = 'Ignore this Request';
        } else if ($stateParams.statusname === 'completed') {
            $scope.QuoteStatusName = 'Completed';
        } else if ($stateParams.statusname === undefined) {
            $scope.QuoteStatusName = 'All';
        } else { }

        /*End*/
        $scope.getQuoteServicePhotos = function (id) {
            var params = {};
            params.quoteServiceId = id;
            QuoteServiceQuotePhotosFactory.get(params, function (response) {
                if (angular.isDefined(response.data)) {
                    angular.forEach(response.data, function (value) {
                        if (angular.isDefined(value) && value !== null) {
                            angular.forEach(value.attachment, function (quote_request_views_photo) {
                                if (angular.isDefined(quote_request_views_photo.id) && quote_request_views_photo.foreign_id !== null) {
                                    var hash = md5.createHash(quote_request_views_photo.class + quote_request_views_photo.foreign_id + 'png' + 'entry_big_thumb');
                                    quote_request_views_photo.image_name = 'images/entry_big_thumb/' + quote_request_views_photo.class + '/' + quote_request_views_photo.foreign_id + '.' + hash + '.png';
                                }
                            });
                        }
                    });
                    $scope.quote_request_views_photos = response.data;
                } else {
                    $scope.quote_request_views_photos = [];
                }
            });
        }
        /*$scope.getQuoteServiceAudios = function(id) {
            var params = {};
            params.quoteServiceId = id;
            QuoteServiceQuoteAudiosFactory.get(params, function(response) {
                if (angular.isDefined(response.data)) {
                    $scope.quote_request_views_audios = response.data;
                } else {
                    $scope.quote_request_views_audios = [];
                }
            });
        }*/
        $scope.getQuoteServiceVideos = function (id) {
            var params = {};
            params.quoteServiceId = id;
            QuoteServiceQuoteVideosFactory.get(params, function (response) {
                if (angular.isDefined(response.data)) {
                    $scope.quote_request_views_videos = response.data;
                } else {
                    $scope.quote_request_views_videos = [];
                }
            });
        };
        $scope.getQuoteServiceFAQs = function (id) {
            var params = {
                quoteServiceId: id
            };
            QuoteServiceFaqAnswersFactory.get(params, function (response) {
                if (angular.isDefined(response.data)) {
                    var temp_faqs = [];
                    var temp_faqs_ans = [];
                    var i = 0;
                    angular.forEach(response.data, function (value) {
                        i++;
                        if (value.quote_faq_question_template_id != null) {
                            value.question = value.quote_faq_question_template.question;
                        } else {
                            value.question = value.quote_user_faq_question.question;
                        }
                        temp_faqs.push(value);
                        if (temp_faqs.length === 2 || i === response.data.length) {
                            temp_faqs_ans.push(temp_faqs);
                            temp_faqs = [];
                        }
                    });
                    $scope.quote_request_views_faqs = temp_faqs_ans;
                }
            });
        }
        $scope.button_save_btn = false;
        $scope.addRequestMessages = function (valid, messages) {
            if(valid && !$scope.button_save_btn)
            {
            $scope.button_save_btn = true;
            $scope.conversation.foreign_id = $scope.quote_request_views_detail.id;
            $scope.conversation.subject = $scope.quote_request_views_detail.quote_request.title;
            $scope.conversation.class = 'QuoteBid';
            $scope.conversation.parent_id = 0;
            $scope.conversation.is_private = 0;
            MessagesFactory.create($scope.conversation, function (response) {
                $scope.response = response;
                if ($scope.response.error.code === 0) {
                    $scope.button_save_btn = false;
                    $scope.MessagePage = 1;
                    $scope.quote_request_views_messages = [];
                    $scope.getMessages();
                    messages.$setPristine(); 
                    messages.$setUntouched();
                } else {
                    flash.set($filter("translate")("Some thing went wrong. Please try again later"), 'error', false);
                    $scope.button_save_btn = false;
                }
                $scope.conversation = {};
            });
          }
        };
        $scope.getMessages = function () {
            var params = {};
            params.class = 'QuoteBid';
            params.page = $scope.MessagePage;
            params.sortby = 'desc';
            params.limit = 10;
            params.foreign_id = $scope.quote_request_views_detail.id;
            MessagesFactory.get(params, function (response) {
                if (angular.isDefined(response.data)) {
                    if (angular.isDefined(response._metadata)) {
                        $scope.messageNoOfPages = response._metadata.last_page;
                        $scope.messageTotal = response._metadata.total;
                        $scope.messageTotal = response._metadata.total - (response._metadata.current_page * response._metadata.per_page );
                    }
                    angular.forEach(response.data, function (value) {
                        if (angular.isDefined(value) && value !== null) {
                            if (angular.isDefined(value.user.attachment) && value.user.attachment !== null) {
                                var hash = md5.createHash(value.user.attachment.class + value.user.attachment.foreign_id + 'png' + 'small_thumb');
                                value.image_name = 'images/small_thumb/' + value.user.attachment.class + '/' + value.user.attachment.foreign_id + '.' + hash + '.png';
                            } else {
                                value.image_name = $window.theme + 'images/default.png';
                            }
                        }
                        $scope.quote_request_views_messages.push(value);
                    });
                }
            });
        }
        $scope.setHired = function (id) {
                    swal({ //jshint ignore:line
                        title: $filter("translate")("Are you sure you want to change the status to Hire?"),
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
                            params.quote_status_id = ConstQuoteStatuses.Hired;
                            params.quoteBidId = id;
                            QuoteBidFactory.put(params, function (response) {
                                $scope.response = response;
                                if ($scope.response.error.code === 0) {
                                    flash.set($filter("translate")("Hired successfully."), 'success', false);
                                    if ($scope.quote_request_views_detail.quote_request.is_request_for_buy) {
                                        $location.path('/quote_bids/my_requests/' + $scope.requestorId + '/' + ConstQuoteStatuses.Hired + '/hired?type=sales');
                                    } else {
                                        $location.path('/quote_bids/my_requests/' + $scope.requestorId + '/' + ConstQuoteStatuses.Hired + '/hired');
                                    }
                                } else {
                                    flash.set($filter("translate")("Some thing went wrong. Please try again later"), 'error', false);
                                }
                            });
                        }
                    });
        }
        $scope.setAsClosed = function (id) {
                    swal({ //jshint ignore:line
                        title: $filter("translate")("Are you sure you want to change the change status to Close?"),
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
                            params.quote_status_id = ConstQuoteStatuses.Closed;
                            params.quoteBidId = id;
                            QuoteBidFactory.put(params, function (response) {
                                $scope.response = response;
                                if ($scope.response.error.code === 0) {
                                    flash.set($filter("translate")("Closed successfully."), 'success', false);
                                    $location.path('/quote_bids/my_requests/' + $scope.requestorId + '/' + ConstQuoteStatuses.Closed + '/closed?type=sales');
                                } else {
                                    flash.set($filter("translate")("Some thing went wrong. Please try again later"), 'error', false);
                                }
                            });
                        }
                    });
        }
        $scope.request_pagination = function () {
            $scope.loadPage = parseInt($scope.loadPage) + 1;
            $scope.index();
        };
        $scope.request_message_pagination = function () {
            $scope.MessagePage = parseInt($scope.MessagePage) + 1;
            $scope.getMessages();
        };
        $scope.makePayment = function ($bid_data) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/order_payments.html',
                backdrop: 'static',
                scope: $scope,
                controller: 'OrderPaymentsController'
            });
        };
        $scope.scroll_to = function (eID) {
            anchorSmoothScroll.scrollTo(eID);
        };
    }]);