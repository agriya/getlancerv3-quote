'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteServiceViewController
 * @description
 * # QuoteServiceViewController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteServiceViewController', ['$window', '$rootScope', '$scope', '$stateParams', 'flash', 'md5', '$filter', '$uibModal', '$location', '$timeout', '$state', 'QuoteServiceFactory', 'anchorSmoothScroll', 'Slug', '$uibModalStack', function($window, $rootScope, $scope, $stateParams, flash, md5, $filter, $uibModal, $location, $timeout, $state, QuoteServiceFactory, anchorSmoothScroll, Slug, $uibModalStack) {
        $scope.index = function() {
            $scope.absUrl = $location.absUrl()
            $scope.loader = true;
            var params = {};
            params.quoteServiceId = $stateParams.quoteServiceId;
            params.type = 'view';
            $scope.quote_services = $stateParams.quoteServiceId;
            $scope.quote_service_media_total = 0;
            $scope.quote_service_image = $window.theme + 'images/no-image.png';
            QuoteServiceFactory.get(params, function(response) {
                if (parseInt(response.error.code) === 0) {
                    $scope.show_response_page = true;
                if (angular.isDefined(response.data)) {
                    if (angular.isDefined(response.data.attachment) && response.data.attachment !== null) {
                        var hash = md5.createHash(response.data.attachment.class + response.data.attachment.foreign_id + 'png' + 'normal_thumb');
                        $scope.quote_service_image = 'images/normal_thumb/' + response.data.attachment.class + '/' + response.data.attachment.foreign_id + '.' + hash + '.png';
                    }
                    $scope.quote_service = response.data;
                    $scope.quote_service_media_total = parseInt(response.data.quote_service_photo_count) + parseInt(response.data.quote_service_video_count) + parseInt(response.data.quote_service_audio_count);
                    $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Service") + ' '+'-'+' '+ $scope.quote_service.business_name;
                } else {
                    flash.set($filter("translate")("Invalid request."), 'error', false);
                    $scope.quote_services = [];
                }
                $scope.loader = false;
                }
            });
        };
        function createSlug(input) {
            return Slug.slugify(input);
        }
        $scope.closeInstance = function() {
            $uibModalStack.dismissAll();
        };
        $scope.index();
        $scope.quoteServiceViewScroll = function(eID) {
            var current_state = $state.current.name;
            if (current_state === 'quote_service') {
                anchorSmoothScroll.scrollTo(eID);
            }
        };
    }]);