'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteMyWorksController
 * @description
 * # QuoteMyWorksController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteMyWorksController', ['$window', '$rootScope', '$scope', '$http', '$stateParams', '$state', 'flash', 'md5', '$filter', '$uibModal', '$uibModalStack', '$location', 'ServiceProvidersQuoteBidsFactory', 'QuoteServiceFactory', 'moment', 'ConstQuoteStatuses', 'ConstBidStatuses', 'ConstQuoteTypes', 'QuoteServiceFaqAnswersFactory', 'QuoteBidFactory', 'ServiceProvidersFactory', 'MessagesFactory', 'anchorSmoothScroll', 'ConstPayToEscrow', 'UserMeFactory', '$document', '$timeout','SweetAlert', function ($window, $rootScope, $scope, $http, $stateParams, $state, flash, md5, $filter, $uibModal, $uibModalStack, $location, ServiceProvidersQuoteBidsFactory, QuoteServiceFactory, moment, ConstQuoteStatuses, ConstBidStatuses, ConstQuoteTypes, QuoteServiceFaqAnswersFactory, QuoteBidFactory, ServiceProvidersFactory, MessagesFactory, anchorSmoothScroll, ConstPayToEscrow, UserMeFactory, $document, $timeout,SweetAlert) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("My Works");
        $scope.ConstQuoteStatuses = ConstQuoteStatuses;
        $scope.ConstBidStatuses = ConstBidStatuses;
        $scope.ConstQuoteTypes = ConstQuoteTypes;
        $scope.ConstPayToEscrow = ConstPayToEscrow;
        //$rootScope.quote_my_works_detail_duplicate = false;
        $scope.loadPage = 1;
        $scope.MessagePage = 1;
        $scope.bid = {};
        //$scope.status = 0;
        $scope.conversation = {};
        $scope.quote_my_works = [];
        $scope.text_enter = false;
        $scope.getCreditCount = function () {
            UserMeFactory.get({}, function (response) {
                $scope.available_credit_count = response.data.available_credit_count;
            });
        };
          $scope.limit2 = 2;
        $scope.index = function () {
            $scope.loader = true;
            var title;
            $scope.getCreditCount();
            var quote_my_works = [];
            $scope.bid_index = 0;
            var user_params = {};
            user_params.serviceProviderUserId = $rootScope.user.id;
            user_params.page = $scope.loadPage;
            $scope.serviceid = $stateParams.serviceid;
            if (($stateParams.type == 'sales') && ($stateParams.type !== undefined) && ($rootScope.settings.IS_BUY_OPTION_ENABLED == $rootScope.ConstQuoteBuyOption.Enabled)) {
                user_params.is_request_for_buy = 1;
                $scope.quote_type = true;
                title = "Requests for Sales";
            } else {
                user_params.is_request_for_buy = 0;
                $scope.quote_type = false;
                title = "My Works";
            }
             if($stateParams.serviceid)
            {
            var params ={};
            params.userId = $rootScope.user.id;
            ServiceProvidersFactory.get(params, function (response) 
                {
                    $scope.QuoteServices = response.data;
                    angular.forEach($scope.QuoteServices, function (value) {
                    if (value.id === parseInt($stateParams.serviceid)) {
                            $scope.request_filter = value;
                        }
                    });    
                    });
            }else{
               $scope.request_filter = false; 
            }
            if ($stateParams.status !== undefined) {
                  if(parseInt($stateParams.status) ===  $scope.ConstQuoteStatuses.Closed)
                {
                    user_params.quote_bid_status_id = $scope.ConstQuoteStatuses.Closed + ',' + $scope.ConstQuoteStatuses.NotCompleted;
                }else{
                      user_params.quote_bid_status_id = $stateParams.status;
                }
               /* user_params.quote_bid_status_id = $stateParams.status;*/
                $scope.status = $stateParams.status;
                var statues_name = $stateParams.statusname;
                statues_name = statues_name.replace(/_/g, " ");
                title = title + ' - ' + statues_name.charAt(0)
                    .toUpperCase() + statues_name.slice(1);
            }
            if ($stateParams.status === undefined) {
                $state.go('quote_my_works_filter', {
                    'serviceid': 'all',
                    'status': '1',
                    'statusname': 'new'
                });
            }
            if($stateParams.serviceid !== 'all')
            {
                $scope.serviceid = $stateParams.serviceid;
                user_params.quote_service_id = $stateParams.serviceid ;
            }else{
                 $scope.serviceid = 'all';
            }
            ServiceProvidersQuoteBidsFactory.get(user_params, function (response) {
                $rootScope.tmp_quote_my_works = "";
                $rootScope.quote_my_works_detail_duplicate = false;
                if (angular.isDefined(response._metadata)) {
                    $scope.noOfPages = response._metadata.last_page;
                }
                angular.forEach(response.data, function (value) {                    
                    if (angular.isDefined(value) && value !== null) {
                        if (angular.isDefined(value.attachment) && value.attachment !== null) {
                            var hash = md5.createHash(value.attachment.class + value.attachment.foreign_id + 'png' + 'medium_thumb');
                            value.image_name = 'images/medium_thumb/' + value.attachment.class + '/' + value.attachment.foreign_id + '.' + hash + '.png';
                        } else {
                            value.image_name = $window.theme + 'images/default.png';
                        }
                    }
                    $scope.quote_my_works.push(value);
                });
                if ($scope.bid.quoteBidId) {
                    $scope.getBidDetails($scope.bid.quoteBidId);
                } else {
                    if ($scope.quote_my_works.length) {
                        if ($stateParams.id === undefined) {
                            $scope.getBidDetails($scope.quote_my_works[0].id);
                        } else {
                            $scope.getBidDetails($stateParams.id);
                        }

                    }
                }
                $scope.loader = false;
            });
        };
        /*var params ={};
        params.userId = $rootScope.user.id;
        ServiceProvidersFactory.get(params, function (response) 
            {
                $scope.QuoteServices = response.data;
            });*/
        /*  Status name for display - Begin*/
        if ($stateParams.statusname === 'new') {
            $scope.StatusName = 'New';
        } else if ($stateParams.statusname === 'under_discussion') {
            $scope.StatusName = 'Under Discussion';
        } else if ($stateParams.statusname === 'hired') {
            $scope.StatusName = 'Hired';
        } else if ($stateParams.statusname === 'not_interested') {
            $scope.StatusName = 'Ignore this Request';
        } else if ($stateParams.statusname === 'completed') {
            $scope.StatusName = 'Completed';
        } else if ($stateParams.statusname === undefined) {
            $scope.StatusName = 'Active';
        } else if ($stateParams.statusname === 'under-discussion') {
            $scope.StatusName = 'Under Discussion';
        } 
        /*End*/
          $scope.searchRequest = function (requestid, type) {
            if (type !== 'All') {
                angular.forEach($scope.QuoteServices, function (value) {
                    if (value.id === requestid) {
                        $scope.request_filter = value;
                    }
                });                
            } else {
                $scope.request_filter = false;
            }
            if($stateParams.status === undefined && $stateParams.statusname === undefined){
                    $state.go('quote_my_works_change',
                        {
                            serviceid : requestid
                        });
            } else {
                    $state.go('quote_my_works_filter',
                    {
                            serviceid : requestid,
                            status : $stateParams.status,
                            statusname : $stateParams.statusname,             
                    });
            }
        };
        $scope.index();
        $scope.show_form = function () {
            $scope.text_enter = true;
        };
        $document.on('click', function ($event) {
            $timeout(function () {
                if ($event.target.id == 'inputQuoteAmount3' || $event.target.id == 'inputQuoteType3' || $event.target.id == 'inputQuotePriceNote3') {
                    $scope.text_enter = true;
                } else{
                    $scope.text_enter = false;
                }
            }, 100)
        });

        $scope.getBidDetail = function (bid_id, bid_index) {
            $rootScope.quoteMyWorkCalled = 1;
            $rootScope.tmp_quote_my_works = $scope.quote_my_works;
            $rootScope.tmp_quote_my_works_detail = $scope.quote_my_works_detail;
            if ($stateParams.status === undefined && $stateParams.statusname === undefined) {
                $state.go('quote_my_works_change',
                    {
                        requestId: $stateParams.requestId,
                        id: bid_id,
                    });
            } else {
                $state.go('quote_my_works_filter_change',
                    {
                        serviceid: 'all',
                        status: $stateParams.status,
                        statusname: $stateParams.statusname,
                        id: bid_id,
                    });
            }
        }
        $scope.getBidDetails = function (bid_id, bid_index) {
            $scope.Status_name = $state.params.statusname;
            $scope.Status_id = $state.params.id;
            $scope.quote_my_work_messages = [];
            delete $scope.quote_my_works_detail;
            var found = $filter('filter')($scope.quote_my_works, {
                id: parseInt(bid_id)
            }, true);

            if (found.length) {
                $scope.text_enter = false;
                $rootScope.tmp_quote_my_works_detail = "";
                $rootScope.quote_my_works_detail_duplicate = true;
                $scope.quote_my_works_detail = found[0];
                $scope.bid_index = bid_index;
                $scope.getMessages($scope.quote_my_works_detail.id);
                $scope.bid.quote_amount = parseInt($scope.quote_my_works_detail.quote_amount);
                $scope.bid.quote_type = $scope.quote_my_works_detail.quote_type;
                $scope.bid.price_note = $scope.quote_my_works_detail.price_note;
                $scope.bid.quote_status_id = $scope.quote_my_works_detail.quote_status_id;
                $scope.setAsReaded(bid_id);
                found[0].is_provider_readed = true;
                if (angular.isDefined($scope.quote_my_works_detail.user.attachment) && $scope.quote_my_works_detail.user.attachment !== null) {
                    var hash = md5.createHash($scope.quote_my_works_detail.user.attachment.class + $scope.quote_my_works_detail.user.attachment.foreign_id + 'png' + 'small_thumb');
                    $scope.quote_my_works_detail.image_name_new = 'images/small_thumb/' + $scope.quote_my_works_detail.user.attachment.class + '/' + $scope.quote_my_works_detail.user.attachment.foreign_id + '.' + hash + '.png';
                } else {
                    $scope.quote_my_works_detail.image_name_new = $window.theme + 'images/default.png';
                }
                $rootScope.tmp_quote_my_works_detail = $scope.quote_my_works_detail;
            }
        if($rootScope.settings.SENDING_QUOTE_REQUEST_FLOW_TYPE === 'Limited Quote Per Limited Period' && ($rootScope.settings.QUOTE_VISIBLE_LIMIT <= $scope.quote_my_works_detail.quote_request.quote_bid_count) && ($scope.quote_my_works_detail.quote_request.is_updated_bid_visibility_to_requestor === false))
            {
                $scope.bid.is_okay_with_delay_quote = 1;
            }
        };
           $scope.setLimit = function (lim) {
                $scope.limit2 = (lim <= 0) ? $scope.quote_my_works_detail.quote_request.form_field_submission.length : lim;
            };
        //    href="#!/my_works/{{quote_my_work.quote_status_id}}/{{Status_name}}?id={{quote_my_work.id}}"
        $scope.sendQuote = function (send_quote_valid) {
            if ($scope.bid.quote_status_id == ConstQuoteStatuses.New) {
                $scope.bid.quote_status_id = ConstQuoteStatuses.UnderDiscussion;
            }
            $scope.bid.quoteBidId = $scope.quote_my_works_detail.id;
            QuoteBidFactory.put($scope.bid, function (response) {
                $scope.response = response;
                if ($scope.response.error.code === 0) {
                    flash.set($filter("translate")("Quote sent successfully."), 'success', false);
                    $scope.getCreditCount();
                    $rootScope.quote_my_works('update');
                    if ($scope.quote_my_works_detail.quote_status_id == ConstQuoteStatuses.UnderDiscussion) {
                        var found = $filter('filter')($scope.quote_my_works, {
                            id: $scope.bid.quoteBidId
                        }, true);
                        if (found.length) {
                            found[0].quote_amount = $scope.bid.quote_amount;
                            found[0].quote_type = $scope.bid.quote_type;
                            found[0].price_note = $scope.bid.price_note;
                        }
                    }
                    if ($scope.quote_my_works_detail.quote_request.is_request_for_buy) {
                        $location.path('/my_works/all' + ConstQuoteStatuses.UnderDiscussion + '/under_discussion?type=sales');
                    } else {
                       /* $location.path('/my_works/' + ConstQuoteStatuses.UnderDiscussion + '/under_discussion');*/
                          $state.go('quote_my_works_filter', {
                            'serviceid': $stateParams.serviceid,
                            'status': ConstQuoteStatuses.UnderDiscussion ,
                            'statusname': 'new'
                        });
                    }
                    $scope.text_enter = false;
                } else {
                    flash.set($filter("translate")("Quote could not sent try again later"), 'error', false);
                }
                UserMeFactory.get({}, function (response) {
                    $scope.available_credit_count = response.data.available_credit_count;
                });
            });
        };

        $scope.uploadMessage = function (file) {
            $scope.conversation.image = {}
            Upload.upload({
                url: '/api/v1/attachments?class=MessageContent',
                data: {
                    file: file
                }
            })
                .then(function (response) {
                    if (response.data.error.code === 0) {
                        $scope.conversation.image.attachment = response.data.attachment;
                    }
                });
        };
        $scope.message_save_btn = false;
        $scope.addMessages = function (valid, messages) {
            if(valid && !$scope.message_save_btn)
            {
            $scope.message_save_btn = true;
            $scope.conversation.foreign_id = $scope.quote_my_works_detail.id;
            $scope.conversation.class = 'QuoteBid';
            $scope.conversation.subject = $scope.quote_my_works_detail.quote_request.title;
            $scope.conversation.parent_id = 0;
            $scope.conversation.is_private = 0;
            MessagesFactory.create($scope.conversation, function (response) {
                $scope.response = response;
                if ($scope.response.error.code === 0) {
                    $scope.message_save_btn = false;
                    $scope.MessagePage = 1;
                    $scope.quote_my_work_messages = [];
                    $scope.getMessages($scope.quote_my_works_detail.id);
                    messages.$setPristine(); 
                    messages.$setUntouched();
                } else {
                    flash.set($filter("translate")("Some thing went wrong. Please try again later"), 'error', false);
                    $scope.message_save_btn = false;
                }
                $scope.conversation = {};
            });
            }
            
        };
     
        $scope.getMessages = function (id) {
            var params = {};
            params.foreign_id = id;
            params.class = 'QuoteBid';
            params.sortby = 'desc';
            params.page = $scope.MessagePage;
            params.limit = 10;
            MessagesFactory.get(params, function (response) {
                if (angular.isDefined(response.data)) {
                    if (angular.isDefined(response._metadata)) {
                        $scope.messageNoOfPages = response._metadata.last_page;
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
                        $scope.quote_my_work_messages.push(value);
                    });
                }
            });
        }

        $scope.setAsCompleted = function (id) {
                    SweetAlert.swal({
                        title: $filter("translate")("Are you sure you want to change status to completed?"),
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: true,
                        animation:false,
                    }, function (isConfirm) {
                        if (isConfirm) {
                            $scope.bid.quote_status_id = ConstQuoteStatuses.Completed;
                            $scope.bid.quoteBidId = id;
                            QuoteBidFactory.put($scope.bid, function (response) {
                                $scope.response = response;
                                if ($scope.quote_my_works_detail.quote_request.is_request_for_buy) {
                                    if ($scope.response.error.code === 0) {
                                        $location.path('/my_works/all' + ConstQuoteStatuses.Completed + '/completed?type=sales');
                                    } else {
                                        flash.set($filter("translate")("Some thing went wrong. Please try again later"), 'error', false);
                                    }
                                } else {
                                    if ($scope.response.error.code === 0) {
                                       // $location.path('/my_works/' + ConstQuoteStatuses.Completed + '/completed');
                                        $state.go('quote_my_works_filter', {
                                            'serviceid': $stateParams.serviceid,
                                            'status': ConstQuoteStatuses.Completed ,
                                            'statusname': 'completed'
                                        });
                                        flash.set($filter("translate")("Completed successfully."), 'success', false);
                                    } else {
                                        flash.set($filter("translate")("Some thing went wrong. Please try again later"), 'error', false);
                                    }
                                }
                            });
                        }
                    });
                };

        $scope.setAsNotInterested = function (id) {
                    SweetAlert.swal({
                        title: $filter("translate")("Are you sure you want to ignore this request?"),
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: true,
                        animation:false,
                    }, function (isConfirm) {
                        if (isConfirm) {
                            $scope.bid.quote_status_id = ConstQuoteStatuses.NotInterested;
                            $scope.bid.quoteBidId = id;
                            QuoteBidFactory.put($scope.bid, function (response) {
                                $scope.response = response;
                                if ($scope.response.error.code === 0) {
                                    angular.element(document.querySelector('.work' + id))
                                        .remove();
                                    flash.set($filter("translate")("Marked as Not Interested."), 'success', false);
                                } else {
                                   flash.set($scope.response.error.message, 'error', false);
                                }
                            });
                        }
                    });
                };        
        $scope.setAsReaded = function (id) {
            var params = {};
            params.quoteBidId = id;
            params.is_provider_readed = 1;
            QuoteBidFactory.put(params);
        };
        $scope.ourwork_pagination = function () {
            $scope.loadPage = parseInt($scope.loadPage) + 1;
            $scope.index();
        };
        $scope.message_pagination = function () {
            $scope.MessagePage = parseInt($scope.MessagePage) + 1;
            $scope.getMessages($scope.quote_my_works_detail.id);
        };
        $scope.scroll_to = function (eID) {
            anchorSmoothScroll.scrollTo(eID);
        };
    }]);