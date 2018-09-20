'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteServiceFaqsManageController
 * @description
 * # QuoteServiceFaqsManageController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteServiceFaqsManageController', ['$window', '$rootScope', '$scope', '$http', '$stateParams', '$state', 'flash', 'md5', '$filter', '$uibModal', '$location', 'QuoteServiceFactory', 'QuoteServiceFaqAnswersFactory', 'FaqAnswersFactory', 'FaqAnswerFactory', 'QuoteFaqQuestionTemplatesFactory', 'QuoteFaqQuestionTemplateFactory','$timeout', function($window, $rootScope, $scope, $http, $stateParams, $state, flash, md5, $filter, $uibModal, $location, QuoteServiceFactory, QuoteServiceFaqAnswersFactory, FaqAnswersFactory, FaqAnswerFactory, QuoteFaqQuestionTemplatesFactory, QuoteFaqQuestionTemplateFactory, $timeout) {
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
            params.limit = 'all';
            QuoteServiceFaqAnswersFactory.get(params, function(response) {
                angular.forEach(response.data, function(value) {
                    if (value.quote_faq_question_template_id != null) {
                        value.question = value.quote_faq_question_template.question;
                    } else {
                        value.question = value.quote_user_faq_question.question;
                    }
                });
                $scope.quote_service_faqs = response.data;
                $scope.loader = false;
            });
            var params_question = {};
            params_question.sort = 'id';
            params_question.sortby = 'desc';
            params_question.fields = 'question,id';
            params_question.limit = '20';
            QuoteFaqQuestionTemplatesFactory.get(params_question, function(response) {
                $scope.quote_service_faqs_templates = response.data;
            });
            var paramsService = {};
            paramsService.quoteServiceId = $stateParams.quoteServiceId;
         //   paramsService.fields = 'business_name';
            QuoteServiceFactory.get(paramsService, function(response) {
                $scope.quote_active = response.data.is_active;
                $scope.business_name = response.data.business_name;
                $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' +  ($scope.business_name) + ' ' + '-' + ' ' +("FAQs");
            });
        };
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

        $scope.QuoteFaqTemplateAnswer = function(id, questionName) {
            var params_question_template = {};
            params_question_template.quoteFaqQuestionTemplateId = id;
            params_question_template.fields = 'question';
            $scope.quoteFaqQuestionTemplateId = id;
            QuoteFaqQuestionTemplateFactory.get(params_question_template, function(response) {
                $scope.question = response.data.question;
                $scope.answer = '';
                $scope.modalInstance = $uibModal.open({
                    templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_faq_template_add.html',
                    backdrop: 'static',
                    controller: 'ModalFaqTemplateController',
                    resolve: { // This fires up before controller loads and templates rendered
                        question: function() {
                            return $scope.question;
                        },
                        answer: function() {
                            return $scope.answer;
                        },
                        quoteFaqQuestionTemplateId: function() {
                            return $scope.quoteFaqQuestionTemplateId;
                        }
                    }
                });
            });
        };
        $scope.add_template_answer = function() {
            var param = {};
            param.quote_service_id = $scope.quoteServiceId;
            param.quote_faq_question_template_id = $scope.quoteFaqQuestionTemplateId;
            param.answer = $scope.answer;
            FaqAnswersFactory.post(param, function(response) {
                $scope.response = response;
                if ($scope.response.error.code === 0) {
                    $state.reload();
                    $scope.ok();
                    flash.set($filter("translate")("Added successfully"), 'success', false);
                } else {
                    $scope.ok();
                    flash.set($filter("translate")("Could not be add"), 'error', false);
                }
            });
        };
        $scope.QuoteFaqDelete = function(id) {
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
                            param.quoteFaqAnswerId = id;
                            FaqAnswerFactory.delete(param, function(response) {
                                $scope.response = response;
                                if ($scope.response.error.code === 0) {
                                    $scope.index();
                                    flash.set($filter("translate")("Deleted successfully"), 'success', false);
                                    $timeout(function() {
                                      $state.reload();
                                     },100);
                                } else {
                                    flash.set($filter("translate")("Could not be deleted"), 'error', false);
                                }
                            });
                        }
                    });
        };
        $scope.save_btn = false;
        $scope.add = function(valid) {
            if (valid) {
             $scope.save_btn = true;
            var param = {};
            param.quote_service_id = $scope.quoteServiceId;
            param.question = $scope.question;
            param.answer = $scope.answer;
            FaqAnswersFactory.post(param, function(response) {
                 $scope.save_btn = false;
                $scope.response = response;
                if ($scope.response.error.code === 0) {
                    $state.reload();
                    $scope.ok();
                    flash.set($filter("translate")("Added successfully"), 'success', false);
                } else {
                    $scope.save_btn = false;
                    $scope.ok();
                    flash.set($filter("translate")("Could not be add"), 'error', false);
                }
            });
        }
        };
    
        $scope.update = function() {
            var param = {};
            param.quoteFaqAnswerId = $scope.quoteFaqAnswerId;
            param.question = $scope.question;
            param.answer = $scope.answer;
            FaqAnswerFactory.put(param, function(response) {
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
        $scope.QuoteFaqAdd = function(id) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_faq_add.html',
                backdrop: 'static',
                controller: 'ModalFaqController',
                resolve: { // This fires up before controller loads and templates rendered
                    question: function() {
                        return $scope.question;
                    },
                    answer: function() {
                        return $scope.answer;
                    },
                    quoteFaqAnswerId: function() {
                        return $scope.quoteFaqAnswerId;
                    }
                }
            });
        };
        $scope.$on('$locationChangeSuccess', function() {
            $scope.currentPage = ($stateParams.page !== undefined) ? parseInt($stateParams.page) : 1;
        });
        $scope.paginate_user_faq = function() {
            $location.search('page', parseInt($scope.currentPage));
        };
        $scope.index();
    }]);
angular.module('getlancerApp.Quote')
    .controller('ModalFaqController', function($scope, $uibModalInstance, question, answer, quoteFaqAnswerId) {
        $scope.question = question;
        $scope.answer = answer;
        $scope.quoteFaqAnswerId = quoteFaqAnswerId;
        $scope.ok = function() {
            $uibModalInstance.close();
        };
    });
angular.module('getlancerApp.Quote')
    .controller('ModalFaqTemplateController', function($scope, $uibModalInstance, question, answer, quoteFaqQuestionTemplateId) {
        $scope.question = question;
        $scope.answer = answer;
        $scope.quoteFaqQuestionTemplateId = quoteFaqQuestionTemplateId;
        $scope.ok = function() {
            $uibModalInstance.close();
        };
    });