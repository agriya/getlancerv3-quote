'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteRequestController
 * @description
 * # QuoteRequestController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteRequestController', ['$window', '$rootScope', '$scope', '$http', '$stateParams', '$state', 'flash', 'md5', '$filter', '$uibModal', '$location', 'QuoteRequestFactory', 'QuoteServiceFactory', function($window, $rootScope, $scope, $http, $stateParams, $state, flash, md5, $filter, $uibModal, $location, QuoteRequestFactory, QuoteServiceFactory) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Request Quote");
        $scope.index = function() {
            $scope.quote_service_id = $stateParams.quoteServiceId;
            $scope.form1 = true;
            $scope.form2 = false;
            $scope.form3 = false;
            var user_params = {};
            user_params.quoteServiceId = $scope.quote_service_id
            QuoteServiceFactory.get(user_params, function(response) {
                $scope.quote_request_add = response.data;
            });
        };
        $scope.index();
        $scope.changeState = function(form) {
            if (form === 'form1') {
                $scope.form1 = true;
                $scope.form2 = false;
                $scope.form3 = false;
            } else if (form === 'form2') {
                $scope.form1 = false;
                $scope.form2 = true;
                $scope.form3 = false;
            } else if (form === 'form3') {
                $scope.form1 = false;
                $scope.form2 = false;
                $scope.form3 = true;
            }
        };
        $scope.location_quote = function() {
            var k = 0;
            angular.forEach($scope.quoteRequest.g_address.address_components, function(value, key) {
                //jshint unused:false
                if (value.types[0] === 'locality' || value.types[0] === 'administrative_area_level_2') {
                    if (k === 0) {
                        $scope.quoteRequest.city_name = value.long_name;
                        $scope.disable_city = true;
                    }
                    if (value.types[0] === 'locality') {
                        k = 1;
                    }
                }
                if (value.types[0] === 'administrative_area_level_1') {
                    $scope.quoteRequest.state_name = value.long_name;
                    $scope.disable_state = true;
                }
                if (value.types[0] === 'country') {
                    $scope.quoteRequest.country_iso2 = value.short_name;
                    $scope.disable_country = true;
                }
                if (value.types[0] === 'postal_code') {
                    $scope.quoteRequest.zip_code = parseInt(value.long_name);
                    $scope.disable_zip = true;
                }
                $scope.quoteRequest.latitude = $scope.quoteRequest.g_address.geometry.location.lat();
                $scope.quoteRequest.longitude = $scope.quoteRequest.g_address.geometry.location.lng();
            });
        };
        $scope.formData = {};
        $scope.save = function() {
            $scope.save_btn = true;
            if ($scope.quoteRequest.g_address !== null) {
                $scope.quoteRequest.full_address = $scope.quoteRequest.city_name + ', ' + $scope.quoteRequest.state_name + ', ' + $scope.quoteRequest.country_iso2;
            }
            $scope.quoteRequest.quote_service_id = $scope.quote_service_id;
            $scope.quoteRequest.radius = 50;
            QuoteRequestFactory.post($scope.quoteRequest, function(response) {
                $scope.response = response;
                if ($scope.response.error.code === 0) {
                    flash.set($filter("translate")("Quote request sent successfully."), 'success', false);
                } else {
                    flash.set($filter("translate")("Quote request not sent, Try again later"), 'error', false);
                }
            });
        };
    }]);