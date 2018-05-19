'use strict';
/**
 * @ngdoc directive
 * @name getlancerApp.directive:QuoteServiceFaqs
 * @description
 * # QuoteServiceFaqs
 */
angular.module('getlancerApp')
    .directive('quoteServiceFaqs', function(QuoteServiceFaqAnswersFactory) {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_faqs.html',
            restrict: 'E',
            replace: 'true',
            link: function postLink(scope, element, attrs) {
                var params = {
                    limit: 'all',
                    quoteServiceId: scope.quote_services
                };
                QuoteServiceFaqAnswersFactory.get(params, function(response) {
                    if (angular.isDefined(response.data)) {
                        var temp_faqs = [];
                        var temp_faqs_ans = [];
                        var i = 0;
                        angular.forEach(response.data, function(value) {
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
                        scope.faqs = temp_faqs_ans;
                    }
                });
            }
        };
    })
    .directive('stringToNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function(value) {
                    return parseFloat(value);
                });
            }
        };
    });