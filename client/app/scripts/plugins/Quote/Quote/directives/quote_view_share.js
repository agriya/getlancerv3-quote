'use strict';
angular.module('getlancerApp.Quote')
    .directive('quoteViewShare', function($rootScope, md5, $window, $uibModal, $filter, $state) {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_view_share.html',
            restrict: 'EA',
            replace: 'true',
            scope: 'true',
            link: function postLink(scope, element, attr) {
                scope.ShareModel = function(isvalid) {
                    scope.modalInstance = $uibModal.open({
                        templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_view_share_modal.html',
                        backdrop: 'true',
                        controller: 'QuoteServiceViewController'
                    });
                };
            }
        };
    });