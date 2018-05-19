'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteRequestController
 * @description
 * # QuoteRequestController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteRequestModelController', ['$window', '$rootScope', '$scope', '$http', '$stateParams', '$state', 'flash', 'md5', '$filter', '$uibModal', '$location', 'QuoteRequestFactory', 'QuoteCategoriesQuoteServicesFactory', 'Category_id', 'type', '$builder', 'FormFieldsFactory', 'QuoteRequestsFactory', '$validator', 'Service_id', '$uibModalStack', 'ConstQuoteBuyOption', 'ConstUserRole', '$cookies', 'title', 'service_type', 'ConstServiceType', function ($window, $rootScope, $scope, $http, $stateParams, $state, flash, md5, $filter, $uibModal, $location, QuoteRequestFactory, QuoteCategoriesQuoteServicesFactory, Category_id, type, $builder, FormFieldsFactory, QuoteRequestsFactory, $validator, Service_id, $uibModalStack, ConstQuoteBuyOption, ConstUserRole, $cookies, title, service_type, ConstServiceType) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Request Quote");
        $scope.countriesList = [];
        $scope.citiesList = [];
        if (angular.isDefined($rootScope.settings.ALLOWED_SERVICE_LOCATIONS) && $rootScope.settings.ALLOWED_SERVICE_LOCATIONS !== null) {
            var parsesettingvalue = JSON.parse($rootScope.settings.ALLOWED_SERVICE_LOCATIONS);
            var keys = Object.keys(parsesettingvalue);
            var len = keys.length;
        }
        if (angular.isDefined($rootScope.settings.ALLOWED_SERVICE_LOCATIONS) && len > 0) {
            //var parsesettingvalue = JSON.parse($rootScope.settings.ALLOWED_SERVICE_LOCATIONS);
            angular.forEach(parsesettingvalue.allowed_countries, function (value) {
                $scope.countriesList.push(value.iso_alpha2);
                $scope.modelautocompleteOptions = {
                    componentRestrictions: { country: $scope.countriesList },
                    types: ['geocode']
                };
            });
            angular.forEach(parsesettingvalue.allowed_cities, function (value) {
                $scope.citiesList.push(value.name);
            });
        }
        $scope.quoteRequest = [];
        $scope.ConstUserRole = ConstUserRole;
        $scope.activeBar = [];
        if (service_type == ConstServiceType.Sales) {
            $scope.quoteRequest.is_request_for_buy = 1;
        } else {
            $scope.quoteRequest.is_request_for_buy = 0;
        }
        $scope.index = function () {
            $scope.defaultValue = {};
            $scope.frmvalues = [];
            $scope.quote_service_id = $stateParams.quoteServiceId;
            $scope.ConstQuoteBuyOption = ConstQuoteBuyOption;
            $scope.form0 = true;
            $scope.form1 = false;
            $scope.formfinal = false
            $scope.form_login = false
            $scope.type = type;
            $scope.quoteRequest.title = title;
            if (type === 'category') {
                $scope.getFormFields(Category_id);
                $scope.Category_id = Category_id;
                $scope.form1 = false;
                $scope.form2 = false;
            } else {
                $scope.form1 = false;
                $scope.form2 = false;
                var user_params = {};
                user_params.quote_service_id = Service_id;
                user_params.display_type = "child";
                user_params.limit = 'all';
                QuoteCategoriesQuoteServicesFactory.get(user_params, function (response) {
                    angular.forEach(response.data, function (value) {
                        if (angular.isDefined(value) && value !== null) {
                            if (angular.isDefined(value.quote_categories.attachment) && value.quote_categories.attachment !== null) {
                                var hash = md5.createHash(value.quote_categories.attachment.class + value.quote_categories.attachment.foreign_id + 'png' + 'medium_thumb');
                                value.image_name = 'images/medium_thumb/' + value.quote_categories.attachment.class + '/' + value.quote_categories.attachment.foreign_id + '.' + hash + '.png';
                            } else {
                                value.image_name = $window.theme + 'images/no-image.png';
                            }
                        }
                    });
                    $scope.quote_categories_quote_services = response.data;
                });
                $scope.addActiveBar('form1', 'Select Category');
                $scope.addActiveBar('form1', null);
            }
            $scope.addActiveBar('form2', 'Details');
            if (type === 'category') {
                $scope.addActiveBar('form2', null);
            }
        };
        $scope.quoteRequestForm = function () {
            if ($scope.quoteRequest.title === undefined || $scope.quoteRequest.title === null) {
                document.getElementById("inputTitle3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputTitle3")
                    .setCustomValidity("");
            }
            if ($scope.quoteRequest.description === undefined || $scope.quoteRequest.description === null) {
                document.getElementById("inputDescription3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputDescription3")
                    .setCustomValidity("");
            }
            if ($scope.quoteRequest.best_day_time_for_work === undefined || $scope.quoteRequest.best_day_time_for_work === null) {
                document.getElementById("inputBestDayTimeForWork3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputBestDayTimeForWork3")
                    .setCustomValidity("");
            }
            if ($scope.quoteRequest.phone_no === undefined || $scope.quoteRequest.phone_no === null) {
                document.getElementById("inputPhoneNo3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputPhoneNo3")
                    .setCustomValidity("");
            }
            if ($scope.quoteRequest.zip_code === undefined || $scope.quoteRequest.zip_code === null) {
                document.getElementById("inputZipCode3")
                    .setCustomValidity($filter("translate")("Required"));
            } else {
                document.getElementById("inputZipCode3")
                    .setCustomValidity("");
            }
        }
        $scope.selectCategory = function (select_category_id, name) {
            $scope.Category_id = select_category_id;
            $scope.quoteRequest.title = name;
            $scope.select_categeory_id = select_category_id;
        };
        $scope.CategoryFormChange = function () {
            if (angular.isDefined($scope.Category_id)) {
                $scope.form1 = false;
                $scope.form2 = true;
                $scope.getFormFields($scope.Category_id);
                $scope.addActiveBar('form2', null);
            } else {
                var flashMessage = $filter("translate")("Please select service are you interested in?");
                flash.set(flashMessage, 'error', false);
            }
        };
        $scope.getFormFields = function (Category_id) {
            var params_form = {};
            $scope.showfrms = [];
            var firstfrm = 1;
            params_form.foreign_id = Category_id;
            params_form.class = 'QuoteCategory';
            FormFieldsFactory.get(params_form, function (formvalues) {
                if (formvalues.error.code === 0) {
                    for (var ival = 1; ival < 10; ival++) {
                        /** to do form empty  */
                        if ($builder.forms['default-' + ival] !== undefined) {
                            $builder.forms['default-' + ival] = [];
                        }
                    }
                    angular.forEach(formvalues.data, function (field_type, key) {
                        $scope.addActiveBar('showform' + firstfrm, field_type.name);
                        angular.forEach(field_type.form_fields, function (field_type_response, keynew) {
                            var component_type;
                            var option_values;
                            if (field_type_response.options) {
                                option_values = field_type_response.options.split(",");
                            }
                            var textbox;
                            textbox = $builder.addFormObject('default-' + firstfrm, {
                                id: field_type_response.id,
                                component: field_type_response.input_types.value,
                                label: field_type_response.label,
                                description: '',
                                placeholder: field_type_response.label,
                                required: field_type_response.is_required,
                                options: option_values,
                                editable: true
                            });
                            var obj = {};
                            obj['id'] = field_type_response.id;
                            obj['value'] = field_type_response.name;
                            $scope.frmvalues.push(obj);
                            $scope.defaultValue[textbox.id] = '';
                        });
                        $scope.showfrms[firstfrm] = false;
                        $builder.forms['default-' + firstfrm];
                        firstfrm++;
                        $scope.isformfield = true;
                    });
                    $scope.form_fields_all = formvalues.data;
                    $scope.firstfrm = firstfrm;
                }
            });
        }
        $scope.serviceSavenew = function (index) {
            $validator.validate($scope, 'default-' + index)
                .success(function () {
                    $scope.showfrms[index] = false;
                    var myindexval = index + 1;
                    $scope.addActiveBar('showform' + myindexval, null);
                    if ((index) !== $scope.form_fields_all.length) {
                        $scope.showfrms[index + 1] = true;
                    } else {
                        $scope.serviceSave();
                    }
                });
        }
        $scope.serviceShowprevious = function (index) {
            $scope.showfrms[index - 1] = true;
            $scope.showfrms[index] = false;
            var found = $filter('filter')($scope.activeBar, {
                id: 'login'
            }, true);
            if (found.length) {
                $scope.addActiveBar('login', 'inactive');
            }
            var myindexval = index - 1;
            $scope.addActiveBar('showform' + index, 'inactive');
            $scope.form_login = false;
            if ($scope.quoteRequest.form_fields) {
                angular.forEach($scope.quoteRequest.form_fields, function (dataval, key) {
                    angular.forEach(dataval, function (data, key) {
                        $scope.defaultValue[data.id] = data.value;
                    });
                });
            }
        }

        $scope.QuotaFormSave = function (data) {
            var flashMessage;
            $scope.class = "text-muted";
            if ($scope.quoteRequest.latitude === undefined || $scope.quoteRequest.longitude === undefined) {
                if ($scope.class === 'text-muted') {
                    $scope.class = 'error';
                } else {
                    $scope.class === 'text-muted';
                }

                // flashMessage = $filter("translate")("Invalid Location.Kindly select Location from autocomplete");
                // flash.set(flashMessage, 'error', false);
                // return true;
            }
            if (data) {
                if ($scope.countriesList.length > 0 && $scope.countriesList.indexOf($scope.quoteRequest.country_iso2) == -1) {
                    flashMessage = $filter("translate")("Address only allowed for Countries " + $scope.countriesList);
                    flash.set(flashMessage, 'error', false);
                    return true;
                }
                if ($scope.citiesList.length > 0 && $scope.citiesList.indexOf($scope.quoteRequest.city_name) == -1) {
                    flashMessage = $filter("translate")("Address only allowed for Cities " + $scope.citiesList);
                    flash.set(flashMessage, 'error', false);
                    return true;
                }
                $scope.quoteRequestForm();
                if (data == true && $scope.quoteRequest.latitude && $scope.quoteRequest.longitude) {
                    if ($scope.form_fields_all.length) {
                        $scope.showfrms[1] = true;
                        $scope.addActiveBar('showform' + 1, null);
                        $scope.form2 = false;
                    } else {
                        $scope.serviceSave();
                    }
                }
            }
        };
        $scope.showMainForm = function () {
            $scope.showfrms[1] = false;
            $scope.form2 = true;
            $scope.addActiveBar('showform' + 1, 'inactive');
        }
        $scope.showRequestform = function () {
            $scope.form0 = false;
            if (type === 'category') {
                $scope.form2 = true;
            } else {
                $scope.form1 = true;
            }
        }
        $scope.showMainFormService = function () {
            $scope.form2 = false;
            $scope.form1 = true;
            $scope.showfrms[1] = false;
            $scope.addActiveBar('form2', 'inactive');
        }
        $scope.location_quote = function () {
            var k = 0;
            angular.forEach($scope.quoteRequest.place.address_components, function (value, key) {
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
                }  else {
                     $scope.disable_zip = false;
                     $scope.quoteRequest.zip_code = '';
                }
                $scope.quoteRequest.latitude = $scope.quoteRequest.place.geometry.location.lat();
                $scope.quoteRequest.longitude = $scope.quoteRequest.place.geometry.location.lng();
                $scope.quoteRequest.address = $scope.quoteRequest.place.name + " " + $scope.quoteRequest.place.vicinity;
                $scope.quoteRequest.full_address = $scope.quoteRequest.place.formatted_address;
            });
        };
        $scope.formData = {};
        $scope.serviceSave = function () {
            $scope.save_btn = true;
            $scope.quoteRequest.quote_request_form_field = [];
            var firstfrm = 0;
            if ($scope.quoteRequest.form_fields) {
                angular.forEach($scope.quoteRequest.form_fields, function (dataval, key) {
                    angular.forEach(dataval, function (data, key) {
                        var obj = {};
                        obj[$scope.frmvalues[firstfrm].value] = data.value;
                        $scope.quoteRequest.quote_request_form_field.push(obj);
                        firstfrm++;
                    });
                });
            }
            var add_quote_request = {};
            add_quote_request.radius = 500;
            /** Need to fix form field then we enable above **/
            /**Need to update radius for login ,register , modelquote request */
            add_quote_request.quote_category_id = $scope.Category_id;
            add_quote_request.title = $scope.quoteRequest.title;
            add_quote_request.description = $scope.quoteRequest.description;
            add_quote_request.best_day_time_for_work = $scope.quoteRequest.best_day_time_for_work;
            add_quote_request.full_address = $scope.quoteRequest.full_address;
            add_quote_request.address = $scope.quoteRequest.address;
            add_quote_request.city_name = $scope.quoteRequest.city_name;
            add_quote_request.state_name = $scope.quoteRequest.state_name;
            add_quote_request.country_iso2 = $scope.quoteRequest.country_iso2;
            add_quote_request.zip_code = $scope.quoteRequest.zip_code;
            add_quote_request.phone_no = $scope.quoteRequest.phone_no;
            add_quote_request.latitude = $scope.quoteRequest.latitude;
            add_quote_request.longitude = $scope.quoteRequest.longitude;
            add_quote_request.is_send_request_to_other_service_providers = $scope.quoteRequest.is_send_request_to_other_service_providers;
            add_quote_request.form_field_submissions = $scope.quoteRequest.quote_request_form_field;
            if ($rootScope.settings.IS_BUY_OPTION_ENABLED == ConstQuoteBuyOption.Enabled) {
                add_quote_request.is_request_for_buy = $scope.quoteRequest.is_request_for_buy;
            } else {
                add_quote_request.is_request_for_buy = service_type;
            }
            add_quote_request.quote_service_id = $scope.quote_service_id;
            if ($rootScope.isAuth) {
                QuoteRequestsFactory.post(add_quote_request, function (response) {
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        flash.set($filter("translate")("Quote request sent successfully."), 'success', false);
                    } else {
                        flash.set($filter("translate")($scope.response.error.message), 'error', false);
                    }
                });
                $uibModalStack.dismissAll();
            } else {
                if ($cookies.get("auth") === null || $cookies.get("auth") === undefined) {
                    $scope.addActiveBar('login', 'Login');
                    $scope.addActiveBar('login', null);
                }
                $scope.form_login = true;
                $cookies.put('quote_requests_factory', JSON.stringify(add_quote_request), {
                    path: '/'
                });
            }
        };
        $scope.quota_requestcancel = function () {
            $uibModalStack.dismissAll();
        };
        $scope.addActiveBar = function (id, name) {
            var found = $filter('filter')($scope.activeBar, {
                id: id
            }, true);
            if (found.length && name === null) {
                found[0].class = 'active';
            } else if (found.length && name === 'inactive') {
                found[0].class = '';
            } else if (found.length === 0 && name !== null && name !== 'inactive') {
                $scope.activeBar.push({
                    class: '',
                    id: id,
                    title: name
                });
            }
        };
        $scope.switch_tab = function (tab) {
            if (tab === 'login') {
                $state.go('users_login', {
                    param: ''
                }, {
                        notify: false
                    });
            } else {
                $state.go('users_register', {
                    param: ''
                }, {
                        notify: false
                    });
            }
        };
        $scope.index();
    }]);