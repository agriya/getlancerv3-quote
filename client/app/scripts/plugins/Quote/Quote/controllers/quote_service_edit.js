'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteServiceEditController
 * @description
 * # QuoteServiceEditController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteServiceEditController', ['$window', '$rootScope', '$scope', '$stateParams', 'flash', 'md5', '$filter', '$uibModal', '$location', 'QuoteServiceCategoriesFactory', 'QuoteServiceFactory', '$timeout', 'Upload', 'ConstServiceType', '$state', 'QuoteAutocompleteUsers', 'ConstUserRole', function($window, $rootScope, $scope, $stateParams, flash, md5, $filter, $uibModal, $location, QuoteServiceCategoriesFactory, QuoteServiceFactory, $timeout, Upload, ConstServiceType, $state, QuoteAutocompleteUsers, ConstUserRole) {
        $scope.site_url = '/ag-admin/#/quote_services/list';
        $scope.quote_edit_id =  $stateParams.id;
       var url = $location.absUrl();
        if($scope.quote_edit_id!== null){
           $scope.url_split = $location.path().split("/")[3];
        }
        $scope.quote_categories = [];
        $scope.user_quote_service_update = {};
        $scope.ConstServiceType = ConstServiceType;
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Edit Services");
        $scope.countriesList = [];
        $scope.citiesList = [];
        if (angular.isDefined($rootScope.settings.ALLOWED_SERVICE_LOCATIONS)) {
            var parsesettingvalue = JSON.parse($rootScope.settings.ALLOWED_SERVICE_LOCATIONS || 0);
            var keys = Object.keys(parsesettingvalue);
            var len = keys.length;
        }
        if (angular.isDefined($rootScope.settings.ALLOWED_SERVICE_LOCATIONS) && len > 0) {
            angular.forEach(parsesettingvalue.allowed_countries, function (value) {
                $scope.countriesList.push(value.name);
                $scope.autocompleteOptions = {
                    componentRestrictions: { country: $scope.countriesList },
                    types: ['geocode']
                };
            });
            angular.forEach(parsesettingvalue.allowed_cities, function (value) {
                $scope.citiesList.push(value.name);
            });
            
        }
        $scope.index = function() {
            $scope.loader = true;
            var year = new Date()
                .getFullYear();
            var range = [];
            range.push(year);
            for (var i = 1; i < 100; i++) {
                range.push(year - i);
            }
            $scope.years = range;
            $scope.quote_service_categories = [];
            var params = {};
            params.limit = 'all';
            params.display_type = 'hierarchical';
            params.sort = 'name';
            params.sortby = 'ASC';
            params.filter = 'active';
            QuoteServiceCategoriesFactory.get(params, function(response) {
                angular.forEach(response.data, function(category) {
                        $scope.quote_service_categories.push(category);
                });
            });
            var user_params = {};
            user_params.quoteServiceId = $stateParams.id;
            $scope.quoteServiceId = $stateParams.id;
            $scope.quote_service_image = $window.theme + 'images/no-image.png';
            var selectedUser = [];
            QuoteServiceFactory.get(user_params, function(response) {
                $scope.quote_edit = response.data;
                selectedUser = response.data.user_id;
                var c = new Date();
                if (angular.isDefined(response.data.attachment) && response.data.attachment !== null) {
                    var hash = md5.createHash(response.data.attachment.class + response.data.attachment.foreign_id + 'png' + 'normal_thumb');
                    $scope.quote_service_image = 'images/normal_thumb/' + response.data.attachment.class + '/' + response.data.attachment.foreign_id + '.' + hash + '.png?' + c.getTime();
                }
                $scope.user_quote_service_update.city_name = response.data.city.name;
                $scope.user_quote_service_update.country_name = response.data.country.name;
                $scope.user_quote_service_update.state_name = response.data.state.name;
                $scope.user_quote_service_update.user_id = response.data.user_id;
                $scope.user_quote_service_update.username = response.data.user.username;
                $scope.user_quote_service_update.zip_code = response.data.zip_code;
                $scope.user_quote_service_update.country_iso2 = response.data.country.iso_alpha2;
                $scope.user_quote_service_update.latitude = response.data.latitude;
                $scope.user_quote_service_update.longitude = response.data.longitude;
                $scope.user_quote_service_update.business_name = response.data.business_name;
                $scope.quote_active = response.data.is_active;
                $scope.user_quote_service_update.how_does_your_service_stand_out = response.data.how_does_your_service_stand_out;
                $scope.user_quote_service_update.what_do_you_enjoy_about_the_work_you_do = response.data.what_do_you_enjoy_about_the_work_you_do;
                $scope.user_quote_service_update.website_url = response.data.website_url;
                $scope.user_quote_service_update.phone_number = parseInt(response.data.phone_number);
                $scope.disable_zip = true;
                $scope.user_quote_service_update.address = response.data.address;
                $scope.place = response.data.full_address;
                $scope.user_quote_service_update.is_service_provider_travel_to_customer_place = response.data.is_service_provider_travel_to_customer_place ? 1 : 0;
                if($scope.user_quote_service_update.is_service_provider_travel_to_customer_place === 0){
                $scope.user_quote_service_update.service_provider_travels_upto = '';
                }else{
                $scope.user_quote_service_update.service_provider_travels_upto = parseInt(response.data.service_provider_travels_upto);
                }
                $scope.user_quote_service_update.is_over_phone_or_internet = response.data.is_over_phone_or_internet ? 1 : 0;
                $scope.user_quote_service_update.is_customer_travel_to_me = response.data.is_customer_travel_to_me ? 1 : 0;
                $scope.user_quote_service_update.number_of_employees = parseInt(response.data.number_of_employees);
                $scope.user_quote_service_update.year_founded = parseInt(response.data.year_founded);
                $scope.user_quote_service_update.is_active = response.data.is_active ? 1 : 0;
                $scope.category_selected = [];
                $scope.user_quote_service_update.quote_categories_add = [];
                angular.forEach(response.data.quote_categories_quote_services, function(value, key) {
                    $scope.user_quote_service_update.quote_categories_add[value.quote_category_id] = true;
                    $scope.category_selected.push(parseInt(value.quote_category_id));
                });
                angular.element(document.getElementsByClassName('btn dropdown-toggle')).prop('title', $scope.user_quote_service_update.username);
                angular.element('.filter-option').text($scope.user_quote_service_update.username);
                QuoteAutocompleteUsers.get(function(response) {
                    if (parseInt(response.error.code) === 0) {
                        $scope.freelancerUser = [];
                        $scope.freelancerUsers = response.data;
                        $scope.user_quote_service_update.user_select = [];
                        angular.forEach($scope.freelancerUsers, function(value) {
                            $scope.freelancerUser.push({
                                id: value.id,
                                text: value.username
                            });
                            });
                        } else {
                            console.log('User Error');
                        }
                    }, function(error) {
                        console.log('Users Error', error);
                });
                
            });
            $scope.loader = false;
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
                             params.quoteServiceId = $scope.quoteServiceId;
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
        $scope.select_parent = function(id) {
            if ($scope.user_quote_service_update.quote_categories_add[id] == false || $scope.user_quote_service_update.quote_categories_add[id] == null) {
                $scope.user_quote_service_update.quote_categories_add[id] = true;
            }
        }
        $scope.select_child = function(parent, id) {
            if ($scope.user_quote_service_update.quote_categories_add[id] == true) {
                angular.forEach(parent, function(value) {
                    $scope.user_quote_service_update.quote_categories_add[value.id] = true;
                });
            } else {
                angular.forEach(parent, function(value) {
                    $scope.user_quote_service_update.quote_categories_add[value.id] = false;
                });
            }
        }
        $scope.checkStatus = function(id, selected_list) {
            if ($.inArray(parseInt(id), selected_list) > -1) {
                return true;
            } else {
                return false;
            }
        };
        $scope.location = function() {
            var k = 0;
       if($scope.place !== undefined)
        {
            angular.forEach($scope.place.address_components, function(value, key) {
                //jshint unused:false
                if (value.types[0] === 'locality' || value.types[0] === 'administrative_area_level_2') {
                    if (k === 0) {
                        $scope.user_quote_service_update.city_name = value.short_name;
                        $scope.user_quote_service_update.city_full_name = value.long_name;
                        $scope.disable_city = true;
                    }
                    if (value.types[0] === 'locality') {
                        k = 1;
                    }
                }
                if (value.types[0] === 'administrative_area_level_1') {
                    $scope.user_quote_service_update.state_name = value.long_name;
                    $scope.disable_state = true;
                }
                if (value.types[0] === 'country') {
                    $scope.user_quote_service_update.country_iso2 = value.short_name;
                     $scope.user_quote_service_update.country_full_name = value.long_name;
                    $scope.disable_country = true;
                }
                if (value.types[0] === 'postal_code') {
                    $scope.user_quote_service_update.zip_code = parseInt(value.long_name);
                    $scope.disable_zip = true;
                }  else {
                     $scope.disable_zip = false;
                     $scope.user_quote_service_update.zip_code = '';
                }
                $scope.user_quote_service_update.latitude = $scope.place.geometry.location.lat();
                $scope.disable_latitude = true;
                $scope.user_quote_service_update.longitude = $scope.place.geometry.location.lng();
                $scope.disable_longitude = true;
                $scope.user_quote_service_update.address = $scope.place.name+" "+$scope.place.vicinity;
                $scope.user_quote_service_update.full_address = $scope.place.formatted_address;
            });
          }
        };
        $scope.uploadServicePhotoEdit = function(file) {
            Upload.upload({
                    url: '/api/v1/attachments?class=QuoteService',
                    data: {
                        file: file
                    }
                })
                .then(function(response) {
                    if (response.data.error.code === 0) {
                        $scope.user_quote_service_update.image = response.data.attachment;
                        $scope.error_message ='';
                    }else{
                        $scope.error_message = response.data.error.message;
                    }
                });
        };
        $scope.quoteCustomValidatorEdit = function() {
            if ($scope.user_quote_service_update.business_name === undefined || $scope.user_quote_service_update.business_name === null) {
                document.getElementById("inputBusinessName3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputBusinessName3")
                    .setCustomValidity("");
            }
            if ($scope.user_quote_service_update.how_does_your_service_stand_out === undefined || $scope.user_quote_service_update.how_does_your_service_stand_out === null) {
                document.getElementById("inputHowDoesYourServiceStandOut3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputHowDoesYourServiceStandOut3")
                    .setCustomValidity("");
            }
            if ($scope.user_quote_service_update.what_do_you_enjoy_about_the_work_you_do === undefined || $scope.user_quote_service_update.what_do_you_enjoy_about_the_work_you_do === null) {
                document.getElementById("inputWhatDoYouEnjoyAboutTheWorkYouDo3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputWhatDoYouEnjoyAboutTheWorkYouDo3")
                    .setCustomValidity("");
            }
            if ($scope.user_quote_service_update.phone_number === undefined || $scope.user_quote_service_update.phone_number === null) {
                document.getElementById("inputPhoneNumber3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputPhoneNumber3")
                    .setCustomValidity("");
            }
            if ($scope.user_quote_service_update.zip_code === undefined || $scope.user_quote_service_update.zip_code === null) {
                document.getElementById("inputZip3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputZip3")
                    .setCustomValidity("");
            }
        }
       $scope.user_quote_disable = function(active_type,form){
            if (form && ($scope.user_quote_service_update.is_over_phone_or_internet == 1 || $scope.user_quote_service_update.is_customer_travel_to_me == 1 || 
             ($scope.user_quote_service_update.is_service_provider_travel_to_customer_place == 1 && $scope.user_quote_service_update.service_provider_travels_upto != null))) {
           if(active_type === 'disable'){
               $scope.user_quote_service_update.is_active = 0;
                $scope.save();
           } else if (active_type === 'active') {
                $scope.user_quote_service_update.is_active = 1;
                 $scope.save();
           }
    };

       };

     $scope.result = false;
        $scope.save_btn = false;
        $scope.save = function(form) {
                angular.forEach($scope.user_quote_service_update.quote_categories_add, function(value, key) {
                    if(value == true){
                        $scope.result = true;
                    }
                        
                });
             if(form && $scope.result && ($scope.user_quote_service_update.is_over_phone_or_internet == 1 || $scope.user_quote_service_update.is_customer_travel_to_me == 1 || 
             ($scope.user_quote_service_update.is_service_provider_travel_to_customer_place == 1 && $scope.user_quote_service_update.service_provider_travels_upto != null))){
                form = true;
                // $scope.required;
            } else {
                    form = false;
            }
            $scope.quoteCustomValidatorEdit();
            if (form && !$scope.error_message) {
                var flashMessage;
                $scope.save_btn = true;
                $scope.user_quote_service_update.quote_categories = [];
                if ($scope.user_quote_service_update.latitude === undefined || $scope.user_quote_service_update.longitude === undefined) {
                     $scope.save_btn = false;
                    flashMessage = $filter("translate")("Invalid full address.Kindly select address from autocomplete");
                    flash.set(flashMessage, 'error', false);
                    return true;
                }
                if ($scope.user_quote_service_update.country_full_name === undefined) {
                    $scope.user_quote_service_update.country_full_name = $scope.user_quote_service_update.country_name;
                }
                 if ($scope.user_quote_service_update.city_full_name === undefined) {
                    $scope.user_quote_service_update.city_full_name = $scope.user_quote_service_update.city_name;
                }
                if ($scope.countriesList.length > 0 && ($scope.countriesList.indexOf($scope.user_quote_service_update.country_full_name) === -1)) {
                    $scope.save_btn = false;
                    flashMessage = $filter("translate")("Address only allowed for Countries " + $scope.countriesList);
                    flash.set(flashMessage, 'error', false);
                    return true;
                }
                if ($scope.citiesList.length > 0  && ($scope.citiesList.indexOf($scope.user_quote_service_update.city_full_name) == -1)) 
                {
                    $scope.save_btn = false;
                    flashMessage = $filter("translate")("Address only allowed for Cities " + $scope.citiesList);
                    flash.set(flashMessage, 'error', false);
                    return true;
                }
                if ($scope.user_quote_service_update.quote_categories_add) {
                    angular.forEach($scope.user_quote_service_update.quote_categories_add, function(value, key) {
                        var obj = {};
                        obj['quote_category_id'] = key;
                        if (value === true) {
                            $scope.user_quote_service_update.quote_categories.push(obj);
                        }
                    });
                }
                delete $scope.user_quote_service_update.quote_categories_add;
                if ($scope.user_quote_service_update.website_url == null) {
                    delete $scope.user_quote_service_update.website_url;
                }
                if (angular.isUndefined($scope.user_quote_service_update.user_id)) {
                       $scope.user_quote_service_update.user_id = ConstUserRole.Admin;
                }
                if($scope.user_quote_service_update.is_service_provider_travel_to_customer_place === 0)
                {
                    delete $scope.user_quote_service_update.service_provider_travels_upto;
                }
                QuoteServiceFactory.put({'quoteServiceId': $scope.quoteServiceId}, $scope.user_quote_service_update, function(response) {
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                         $scope.save_btn = false;
                        flash.set($filter("translate")("Service updated successfully."), 'success', false);
                            // $location.path('/quote_service_photos/' + $scope.response.data.id);
                    if ($rootScope.user.role_id === ConstUserRole.Admin) {
                           var site_url = $scope.site_url;
                           window.location.href = site_url;
                        } else {
                            $state.go('quote_services_faq', {
                                'quoteServiceId': $scope.response.data.id
                            });
                    } 
                    } else {
                        flash.set($filter("translate")("Service could not be updated."), 'error', false);
                        $scope.save_btn = false;
                    }
                });
            } else {
                $timeout(function() {
                    $('.error')
                        .each(function() {
                            if (!$(this)
                                .hasClass('ng-hide')) {
                                $scope.scrollvalidate($(this)
                                    .offset().top-140);
                                return false;
                            }
                        });
                }, 100);
            }
        };
        $scope.scrollvalidate = function(topvalue) {
            $('html, body')
                .animate({
                    'scrollTop': topvalue
                });
        };
        $scope.index();
    }]);