'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteServiceAddController
 * @description
 * # QuoteServiceAddController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteServiceAddController', ['$rootScope', '$scope', '$stateParams', 'flash', 'md5', '$filter', '$uibModal', '$location', 'QuoteServiceCategoriesFactory', 'QuoteServicesFactory', '$timeout', 'Upload', '$state', 'QuoteAutocompleteUsers', 'ConstUserRole', function($rootScope, $scope, $stateParams, flash, md5, $filter, $uibModal, $location, QuoteServiceCategoriesFactory, QuoteServicesFactory, $timeout, Upload, $state, QuoteAutocompleteUsers, ConstUserRole) {
        $scope.site_url = '/ag-admin/#/quote_services/list';
        $scope.quote_categories = [];
		$rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("List Your Service");
		$scope.countriesList = [];
		$scope.citiesList = [];
		if (angular.isDefined($rootScope.settings.ALLOWED_SERVICE_LOCATIONS)) {
			var parsesettingvalue = JSON.parse($rootScope.settings.ALLOWED_SERVICE_LOCATIONS || 0);
			var keys = Object.keys(parsesettingvalue);
			var len = keys.length;
		}
		if (angular.isDefined($rootScope.settings.ALLOWED_SERVICE_LOCATIONS) && len > 0) {
			// var parsesettingvalue = JSON.parse($rootScope.settings.ALLOWED_SERVICE_LOCATIONS);
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
            $scope.quoteServiceAdd = {};
            $scope.quoteServiceAdd.is_service_provider_travel_to_customer_place = 0;
            $scope.quoteServiceAdd.is_customer_travel_to_me = 0;
            $scope.quoteServiceAdd.is_customer_travel_to_me = 0;
            $scope.quoteServiceAdd.is_active = 1;
            var year = new Date()
                .getFullYear();
            var range = [];
            $scope.quoteServiceAdd.year_founded = year
            range.push(year);
            for (var i = 1; i < 100; i++) {
                range.push(year - i);
            }
            $scope.years = range;
            $scope.quoteServiceAdd.is_over_phone_or_internet = 0;
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
            $scope.loader = false;
        };
        $scope.select_parent = function(id) {
            $scope.quoteServiceAdd.quote_categories_add[id] = true;
        }
        $scope.select_child = function(parent, id) {
            if ($scope.quoteServiceAdd.quote_categories_add[id] === true) {
                angular.forEach(parent, function(value) {
                    $scope.quoteServiceAdd.quote_categories_add[value.id] = true;
                });
            } else {
                angular.forEach(parent, function(value) {
                    $scope.quoteServiceAdd.quote_categories_add[value.id] = false;
                });
            }
        }
        $scope.location = function() {
            var k = 0;
            angular.forEach($scope.place.address_components, function(value, key) {
                //jshint unused:false
			    if (value.types[0] === 'locality' || value.types[0] === 'administrative_area_level_2') {
                    if (k === 0) {
                        $scope.quoteServiceAdd.city_name = value.short_name;
                        $scope.quoteServiceAdd.city_full_name = value.long_name;
                        $scope.disable_city = true;
                    }
                    if (value.types[0] === 'locality') {
                        k = 1;
                    }
                }
                if (value.types[0] === 'administrative_area_level_1') {
                    $scope.quoteServiceAdd.state_name = value.long_name;
                    $scope.disable_state = true;
                }
                if (value.types[0] === 'country') {
                    $scope.quoteServiceAdd.country_iso2 = value.short_name;
                     $scope.quoteServiceAdd.country_full_name = value.long_name;
                    $scope.disable_country = true;
                }
                if (value.types[0] === 'postal_code') { 
                    $scope.quoteServiceAdd.zip_code = parseInt(value.long_name);
                    $scope.disable_zip = true;
                } else {
                     $scope.disable_zip = false;
                     $scope.quoteServiceAdd.zip_code = '';
                }
                $scope.quoteServiceAdd.latitude = $scope.place.geometry.location.lat();
                $scope.disable_latitude = true;
                $scope.quoteServiceAdd.longitude = $scope.place.geometry.location.lng();
                $scope.disable_longitude = true;
                $scope.quoteServiceAdd.address = $scope.place.name+" "+$scope.place.vicinity;
                $scope.quoteServiceAdd.full_address = $scope.place.formatted_address;
            });
        };
        $scope.uploadServicePhotoAdd = function(file) {
            Upload.upload({
                    url: '/api/v1/attachments?class=QuoteService',
                    data: {
                        file: file
                    }
                })
                .then(function(response) {
                    if (response.data.error.code === 0) {
                        $scope.quoteServiceAdd.image = response.data.attachment;
                        $scope.error_message = '';
                    }else{
                        $scope.error_message = response.data.error.message;
                    }
                    
                });
        };
        $scope.quoteCustomValidatorAdd = function() {
            if ($scope.quoteServiceAdd.business_name === undefined || $scope.quoteServiceAdd.business_name === null) {
                document.getElementById("inputBusinessName3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputBusinessName3")
                    .setCustomValidity("");
            }
            if ($scope.quoteServiceAdd.how_does_your_service_stand_out === undefined || $scope.quoteServiceAdd.how_does_your_service_stand_out === null) {
                document.getElementById("inputHowDoesYourServiceStandOut3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputHowDoesYourServiceStandOut3")
                    .setCustomValidity("");
            }
            if ($scope.quoteServiceAdd.what_do_you_enjoy_about_the_work_you_do === undefined || $scope.quoteServiceAdd.what_do_you_enjoy_about_the_work_you_do === null) {
                document.getElementById("inputWhatDoYouEnjoyAboutTheWorkYouDo3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputWhatDoYouEnjoyAboutTheWorkYouDo3")
                    .setCustomValidity("");
            }
            if ($scope.quoteServiceAdd.phone_number === undefined || $scope.quoteServiceAdd.phone_number === null) {
                document.getElementById("inputPhoneNumber3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputPhoneNumber3")
                    .setCustomValidity("");
            }
            if ($scope.quoteServiceAdd.zip_code === undefined || $scope.quoteServiceAdd.zip_code === null) {
                document.getElementById("inputZip3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputZip3")
                    .setCustomValidity("");
            }
        }
		
		QuoteAutocompleteUsers.get(function(response) {
                if (parseInt(response.error.code) === 0) {
                    $scope.freelancerUser = [];
                    $scope.freelancerUsers = response.data;
                    angular.forEach($scope.freelancerUsers, function(value) {
                        $scope.freelancerUser.push({
                            id: value.id,
                            text: value.username
                        });
                        
                    });
                } else {
                    console.log('Users Error');
                }
            }, function(error) {
                console.log('Users Error', error);
            });
		$scope.save_btn = false;
        $scope.save = function(form, frmquoteServiceAdd) {
            if (form && !$scope.error_message) {
                $scope.save_btn = true;
                frmquoteServiceAdd.$setPristine();
                frmquoteServiceAdd.$setUntouched();
                var flashMessage;
                if ($scope.quoteServiceAdd.latitude === undefined || $scope.quoteServiceAdd.longitude === undefined) {
                     $scope.save_btn = false;
					flashMessage = $filter("translate")("Invalid full address.Kindly select address from autocomplete");
                    flash.set(flashMessage, 'error', false);
                    return true;
                }
				if ($scope.countriesList.length > 0 && $scope.countriesList.indexOf($scope.quoteServiceAdd.country_full_name) == -1) {
                     $scope.save_btn = false;
					flashMessage = $filter("translate")("Address only allowed for Countries " + $scope.countriesList);
                    flash.set(flashMessage, 'error', false);
                    return true;
                }
				if ($scope.citiesList.length > 0  && $scope.citiesList.indexOf($scope.quoteServiceAdd.city_name) == -1) {
                    $scope.save_btn = false;
					flashMessage = $filter("translate")("Address only allowed for Cities " + $scope.citiesList);
                    flash.set(flashMessage, 'error', false);
                    return true;
                }
                if (!form) {
                    $scope.quoteCustomValidatorAdd();
                    return true;
                }
                $scope.save_btn = true;
                $scope.quoteServiceAdd.quote_categories = [];
                if ($scope.quoteServiceAdd.quote_categories_add) {
                    angular.forEach($scope.quoteServiceAdd.quote_categories_add, function(value, key) {
                        var obj = {};
                        obj['quote_category_id'] = key;
                        $scope.quoteServiceAdd.quote_categories.push(obj);
                    });
                }
                delete $scope.quoteServiceAdd.quote_categories_add;
                if ($scope.quoteServiceAdd.is_customer_travel_to_me === 0) {
                    // $scope.quoteServiceAdd.service_provider_travels_upto = 0;
                }
				if (angular.isUndefined($scope.quoteServiceAdd.user_id)) {
             		  $scope.quoteServiceAdd.user_id = ConstUserRole.Admin;
            	} 
                if ($scope.quoteServiceAdd.is_service_provider_travel_to_customer_place === 0)
                {
                    delete $scope.quoteServiceAdd.service_provider_travels_upto;
                } else {
                $scope.quoteServiceAdd.service_provider_travels_upto;
                }
                QuoteServicesFactory.post($scope.quoteServiceAdd, function(response) {
                    $scope.save_btn = false;
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        flash.set($filter("translate")("Service added successfully."), 'success', false);
                        if ($rootScope.user.role_id === ConstUserRole.Admin) {
                           var site_url = $scope.site_url;
                           window.location.href = site_url;
                        } else {
                        $state.go('quote_services_faq', {
                            'quoteServiceId': $scope.response.data.id
                        }, {
                            reload: true
                        });
                    }
                    } else {
                        flash.set($filter("translate")("Service could not be added."), 'error', false);
                        $scope.save_btn = false;
                    }
                });
            } else {
                $timeout(function() {
                    $('.error').each(function() {
                            if (!$(this).hasClass('ng-hide')) {
                                $scope.scrollvalidate($(this).offset().top-140);
                                return false;
                            }
                        });
                },100);
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