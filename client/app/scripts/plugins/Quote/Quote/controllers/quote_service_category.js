'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:QuoteServiceCategoryController
 * @description
 * # QuoteServiceCategoryController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteServiceCategoryController', ['$window', '$rootScope', '$scope', '$stateParams', 'flash', 'md5', '$filter', '$uibModal', '$location', 'QuoteServicesFactory', 'QuoteServiceCategoriesFactory', 'QuoteServiceCategoryFactory', 'anchorSmoothScroll', 'FormFieldsFactory', 'QuoteRequestsFactory', '$builder', '$validator', 'ConstQuoteBuyOption', 'ConstUserRole', '$cookies', function($window, $rootScope, $scope, $stateParams, flash, md5, $filter, $uibModal, $location, QuoteServicesFactory, QuoteServiceCategoriesFactory, QuoteServiceCategoryFactory, anchorSmoothScroll, FormFieldsFactory, QuoteRequestsFactory, $builder, $validator, ConstQuoteBuyOption, ConstUserRole, $cookies) {
        $scope.quoteRequest = [];
        $scope.defaultValue = {};
        $scope.ConstUserRole = ConstUserRole;
        $scope.frmvalues = [];
        $scope.activeBar = [];
        $scope.index = function() {
            $scope.loader = true;
            $scope.isformfield = false;
            $scope.type = 'category';
            $scope.getFormFields($stateParams.id);
            $scope.Category_id = $stateParams.id;
            $scope.form1 = false;
            $scope.formfinal = false
            var params = {};
            params.sort = 'name';
            params.sortby = 'ASC';
            params.parent_category_id = $stateParams.id
            QuoteServiceCategoriesFactory.get(params, function(response) {
                angular.forEach(response.data, function(value) {
                    if (angular.isDefined(value) && value !== null) {
                        value.image_name = $window.theme + 'images/no-image.png';
                        if (angular.isDefined(value.attachment) && value.attachment !== null) {
                            var hash = md5.createHash(value.attachment.class + value.attachment.foreign_id + 'png' + 'medium_thumb');
                            value.image_name = 'images/medium_thumb/' + value.attachment.class + '/' + value.attachment.foreign_id + '.' + hash + '.png';
                        }
                    }
                });
                $scope.quote_service_types = response.data;
                $scope.loader = false;
            });
            var paramsService = {};
            paramsService.quoteCategoryId = $stateParams.id;
            $scope.quoteRequest.quote_category_id = $stateParams.id;
            paramsService.filter = 'active';
            QuoteServiceCategoryFactory.get(paramsService, function(response) {
                response.data.image_name = theme + 'images/slider2.jpg';
                if (angular.isDefined(response.data.attachment) && response.data.attachment !== null) {
                    var hash = md5.createHash(response.data.attachment.class + response.data.attachment.foreign_id + 'png' + 'large_thumb');
                    response.data.image_name = 'images/large_thumb/' + response.data.attachment.class + '/' + response.data.attachment.foreign_id + '.' + hash + '.png';
                }
                $scope.quote_services_category = response.data;
                if ($scope.quote_services_category.parent_category_id !== null) {
                    $scope.form1 = true;
                }
                $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + response.data.name;
                $scope.quoteRequest.title = $scope.quote_services_category.name;
            });
            $scope.getChildCategories();
            $scope.addActiveBar('form1', 'Details');
            $scope.addActiveBar('form1', null);
        };
        $scope.quoteRequestForm = function() {
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
        $scope.QuotaFormSave = function(data) {
            var flashMessage;
            if ($scope.quoteRequest.latitude === undefined || $scope.quoteRequest.longitude === undefined) {
                flashMessage = $filter("translate")("Invalid Location.Kindly select address from autocomplete");
                flash.set(flashMessage, 'error', false);
                return true;
            }
            $scope.quoteRequestForm();
            if (data == true && $scope.quoteRequest.latitude && $scope.quoteRequest.longitude) {
                if ($scope.form_fields_all.length) {
                    $scope.showfrms[1] = true;
                    $scope.addActiveBar('showform' + 1, null);
                    $scope.form1 = false;
                } else {
                    $scope.serviceSave();
                }
            }
        }
        $scope.showMainForm = function() {
            $scope.showfrms[1] = false;
            $scope.form1 = true;
            $scope.addActiveBar('showform' + 1, 'inactive');
        }
        $scope.quoteCategoryViewScroll = function() {
            anchorSmoothScroll.scrollTo('quote_request');
        };
        $scope.getFormFields = function(Category_id) {
            var params_form = {};
            $scope.showfrms = [];
            var firstfrm = 1;
            params_form.foreign_id = Category_id;
            params_form.class = 'QuoteCategory';
            FormFieldsFactory.get(params_form, function(formvalues) {
                if (formvalues.error.code === 0) {
                    for (var ival = 1; ival < 10; ival++) {
                        /** to do form empty  */
                        if ($builder.forms['default-' + ival] !== undefined) {
                            $builder.forms['default-' + ival] = [];
                        }
                    }
                    angular.forEach(formvalues.data, function(field_type, key) {
                        $scope.addActiveBar('showform' + firstfrm, field_type.name);
                        angular.forEach(field_type.form_fields, function(field_type_response, keynew) {
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
                                description: field_type_response.label,
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
                }
            });
        }
        $scope.location_quote = function() {
            var k = 0;
            angular.forEach($scope.quoteRequest.place.address_components, function(value, key) {
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
                $scope.quoteRequest.latitude = $scope.quoteRequest.place.geometry.location.lat();
                $scope.quoteRequest.longitude = $scope.quoteRequest.place.geometry.location.lng();
                $scope.quoteRequest.address = $scope.quoteRequest.place.name+" "+$scope.quoteRequest.place.vicinity;
                $scope.quoteRequest.full_address = $scope.quoteRequest.place.formatted_address;
            });
        };
        $scope.serviceSavenew = function(index) {
            $validator.validate($scope, 'default-' + index)
                .success(function() {
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
        $scope.serviceShowprevious = function(index) {
            $scope.showfrms[index - 1] = true;
            $scope.showfrms[index] = false;
            $scope.addActiveBar('showform' + index, 'inactive');
            if ($scope.quoteRequest.form_fields) {
                angular.forEach($scope.quoteRequest.form_fields, function(dataval, key) {
                    angular.forEach(dataval, function(data, key) {
                        $scope.defaultValue[data.id] = data.value;
                    });
                });
            }
        }
        $scope.serviceSave = function() {
            $scope.save_btn = true;
            var firstfrm = 0;
            $scope.quoteRequest.quote_request_form_field = [];
            if ($scope.quoteRequest.form_fields) {
                angular.forEach($scope.quoteRequest.form_fields, function(dataval, key) {
                    angular.forEach(dataval, function(data, key) {
                        var obj = {};
                        obj[$scope.frmvalues[firstfrm].value] = data.value;
                        $scope.quoteRequest.quote_request_form_field.push(obj);
                        firstfrm++;
                    });
                });
            }
            var add_quote_request = {};
            /**Need to update login ,register , modelquote request */
            add_quote_request.radius = 500;
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
            if ($rootScope.settings.IS_BUY_OPTION_ENABLED == ConstQuoteBuyOption.Enabled) {
                add_quote_request.is_request_for_buy = $scope.quoteRequest.is_request_for_buy;
            } else {
                add_quote_request.is_request_for_buy = 0;
            }
            add_quote_request.form_field_submissions = $scope.quoteRequest.quote_request_form_field;
            if ($rootScope.isAuth) {
                QuoteRequestsFactory.post(add_quote_request, function(response) {
                    $scope.response = response;
                    if ($scope.response.error.code === 0) {
                        flash.set($filter("translate")("Quote request sent successfully."), 'success', false);
                        $scope.formfinal = true;
                    } else {
                        flash.set($filter("translate")($scope.response.error.message), 'error', false);
                        $scope.form1 = true;
                    }
                });
            } else {
                $scope.openLoginModal('login');
                $cookies.put('quote_requests_factory', JSON.stringify(add_quote_request), {
                    path: '/'
                });
            }
        };
        $scope.openLoginModal = function(tabactive) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/login_modal.html',
                backdrop: 'static',
                controller: 'ModalLoginInstanceController',
                resolve: {
                    tabactive: function() {
                        return tabactive;
                    }
                }
            });
        };
        $scope.getChildCategories = function(q) {
            var param = {};
            param.q = q;
            param.parent_category_id = $stateParams.id;
            return QuoteServiceCategoriesFactory.get(param, function(response) {
                if (angular.isDefined(response.data)) {
                    $scope.category_list = [];
                    angular.forEach(response.data, function(value) {
                        $scope.category_list.push({
                            'id': value.id,
                            'name': value.name,
                            'slug': value.slug
                        });
                        $scope.search_child_categories = $scope.category_list;
                    });
                }
            });
        };
        $scope.getCategories = function(q) {
            var param = {};
            param.q = q;
            return QuoteServiceCategoriesFactory.get(param, function(response) {
                if (angular.isDefined(response.data)) {
                    $scope.category_list = [];
                    angular.forEach(response.data, function(value) {
                        $scope.category_list.push({
                            'id': value.id,
                            'name': value.name,
                            'slug': value.slug
                        });
                        $scope.search_categories = $scope.category_list;
                    });
                }
            });
        };
        $scope.PutChildCategory = function(item) {
            $scope.openQuoteRequestModal(item.id, 'null', 'category', item.name, 0);
        };
        $scope.openQuoteRequestModal = function(Category_id, Service_id, type, title, service_type) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/modalquote_request.html',
                backdrop: 'static',
                size: 'lg',
                controller: 'QuoteRequestModelController',
                windowClass: 'js-service-category',
                resolve: {
                    Category_id: function() {
                        return Category_id;
                    },
                    Service_id: function() {
                        return Service_id;
                    },
                    type: function() {
                        return type;
                    },
                    title: function() {
                        return title;
                    },
                    service_type: function() {
                        return service_type;
                    }
                }
            });
        };
        $scope.addActiveBar = function(id, name) {
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
        $scope.index();
    }]);