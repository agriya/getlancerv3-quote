'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:UsersRegisterController
 * @description
 * # UsersRegisterController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteUsersRegisterController', ['$rootScope', '$scope', 'usersRegister', 'flash', '$location', '$timeout', 'vcRecaptchaService', '$filter', '$cookies', '$uibModalStack', 'ConstUserRole', 'QuoteRequestsFactory', function($rootScope, $scope, usersRegister, flash, $location, $timeout, vcRecaptchaService, $filter, $cookies, $uibModalStack, ConstUserRole, QuoteRequestsFactory) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Register");
        /*jshint -W117 */
        function validatePassword() {
            var pass2 = document.getElementById("password")
                .value;
            var pass1 = document.getElementById("confirm-password")
                .value;
            if (pass2 !== null && pass1 !== null && pass1 !== pass2) {
                document.getElementById("confirm-password")
                    .setCustomValidity("Password Mismatch");
            } else {
                document.getElementById("confirm-password")
                    .setCustomValidity("");
            }
        }
        $(document)
            .on('blur change', "#password, #confirm-password", function() {
                validatePassword();
            });
        $(document)
            .ready(function() {
                if (document.getElementById("is_agree_terms_conditions")
                    .checked === false) {
                    document.getElementById("is_agree_terms_conditions")
                        .setCustomValidity("You must agree to the terms and conditions");
                } else {
                    document.getElementById("is_agree_terms_conditions")
                        .setCustomValidity("");
                }
            });
        $scope.save = function() {
        if ($rootScope.settings.CAPTCHA_TYPE === 'Google reCAPTCHA') {
            var response = vcRecaptchaService.getResponse($scope.widgetId);
            if (response.length === 0) {
                $scope.captchaErr = $filter("translate")("Please resolve the captcha and submit");
            } else {
                $scope.captchaErr = '';
            }
        }
            if ($scope.userSignup.$valid) {
                if ($scope.userChoose === 'freelancer') {
                    $scope.user.is_freelancer = 1;
                } else if ($scope.userChoose === 'empolyer') {
                    $scope.user.is_employer = 1;
                } else {
                    $scope.user.is_freelancer = 1;
                    $scope.user.is_employer = 1;
                }
              /*  if ($cookies.get('quote_requests_factory') !== null && $cookies.get('quote_requests_factory') !== undefined) {
                    $scope.user.is_quick_login = true;
                }*/
                usersRegister.create($scope.user, function(response) {
                    $scope.response = response;
                    delete $scope.response.scope;
                    if ($scope.response.error.code === 0) {
                        $scope.redirect = false;
                        if (parseInt($rootScope.settings.USER_IS_AUTO_LOGIN_AFTER_REGISTER) || ($cookies.get('quote_requests_factory') !== null && $cookies.get('quote_requests_factory') !== undefined)) {
                            $scope.redirect = true;
                            $cookies.put('auth', JSON.stringify($scope.response), {
                                path: '/'
                            });
                            $cookies.put('token', $scope.response.access_token, {
                                path: '/'
                            });
                            $rootScope.user = $scope.response.user;
                            $rootScope.$broadcast('updateParent', {
                                isAuth: true,
                                auth: $scope.response
                            });
                            $rootScope.$emit('updateParent', {
                                isAuth: true
                            });
                            flash.set($filter("translate")("You have successfully registered with our site."), 'success', false);
                        } else if (parseInt($rootScope.settings.USER_IS_EMAIL_VERIFICATION_FOR_REGISTER) && parseInt($rootScope.settings.USER_IS_ADMIN_ACTIVATE_AFTER_REGISTER)) {
                            flash.set($filter("translate")("You have successfully registered with our site you can login after email verification and administrator approval. Your activation mail has been sent to your mail inbox."), 'success', false);
                        } else if (parseInt($rootScope.settings.USER_IS_ADMIN_ACTIVATE_AFTER_REGISTER)) {
                            flash.set($filter("translate")("You have successfully registered with our site. After administrator approval you can login to site."), 'success', false);
                        } else if (parseInt($rootScope.settings.USER_IS_EMAIL_VERIFICATION_FOR_REGISTER)) {
                            flash.set($filter("translate")("You have successfully registered with our site and your activation mail has been sent to your mail inbox."), 'success', false);
                        } else {
                            flash.set($filter("translate")("You have successfully registered with our site."), 'success', false);
                        }
                        /** quote_requests_factory Need to updated fron login.js*/
                        if ($cookies.get('quote_requests_factory') !== null && $cookies.get('quote_requests_factory') !== undefined && $scope.response.role_id !== ConstUserRole.Freelancer) {
                            var add_quote_request = $cookies.get('quote_requests_factory');
                            QuoteRequestsFactory.post(add_quote_request, function(response) {
                                $scope.response = response;
                                if ($scope.response.error.code === 0) {
                                    flash.set($filter("translate")("Quote request sent successfully."), 'success', false);
                                } else {
                                    flash.set($filter("translate")($scope.response.error.message), 'error', false);
                                }
                                $cookies.remove("quote_requests_factory", {
                                    path: "/"
                                });
                            });
                            $location.path('/');
                            $uibModalStack.dismissAll();
                        }
                        if ($cookies.get("redirect_url") !== null && $cookies.get("redirect_url") !== undefined && $scope.redirect) {
                            $location.path($cookies.get("redirect_url"));
                            $cookies.remove('redirect_url');
                        } else {
                            $uibModalStack.dismissAll();
                            $timeout(function() {
                                $location.path('/');
                            }, 1000);
                        }
                    } else {
                        if (angular.isDefined($scope.response.error.fields) && angular.isDefined($scope.response.error.fields.unique) && $scope.response.error.fields.unique.length !== 0) {
                            flash.set($filter("translate")("Please choose different " + $scope.response.error.fields.unique.join()), 'error', false);
                        } else {
                            flash.set($filter("translate")("User could not be added. Please, try again"), 'error', false);
                        }
                    if ($rootScope.settings.CAPTCHA_TYPE === 'Google reCAPTCHA') {
                        vcRecaptchaService.reload($scope.widgetId);
                    }
                    }
                }, function(error) {
                    if (angular.isDefined(error.data.error.fields) && angular.isDefined(error.data.error.fields.unique) && error.data.error.fields.unique.length !== 0) {
                        flash.set($filter("translate")("Please choose different " + error.data.error.fields.unique.join()), 'error', false);
                    } else {
                        flash.set($filter("translate")("User could not be added. Please, try again"), 'error', false);
                    }
                if ($rootScope.settings.CAPTCHA_TYPE === 'Google reCAPTCHA') {
                    vcRecaptchaService.reload($scope.widgetId);
                }
                });
            }
        };
    }]);