'use strict';
/**
 * @ngdoc function
 * @name getlancerApp.controller:UsersLoginController
 * @description
 * # UsersLoginController
 * Controller of the getlancerApp
 */
angular.module('getlancerApp.Quote')
    .controller('QuoteUsersLoginController', ['$rootScope', '$scope', 'usersLogin', 'providers', '$auth', 'flash', '$window', '$location', '$filter', '$cookies', '$state', '$uibModalStack', 'QuoteRequestsFactory', 'ConstUserRole', 'myUserFactory',function($rootScope, $scope, usersLogin, providers, $auth, flash, $window, $location, $filter, $cookies, $state, $uibModalStack, QuoteRequestsFactory, ConstUserRole, myUserFactory) {
        $rootScope.header = $rootScope.settings.SITE_NAME + ' | ' + $filter("translate")("Login");
        if ($cookies.get('auth') !== null && $cookies.get('auth') !== undefined) {
            $rootScope.$emit('updateParent', {
                isAuth: true
            });
            $rootScope.header = $rootScope.settings.SITE_NAME + ' | Home';
            $location.path('/');
        }
        $scope.save_btn = false;
        $scope.save = function(form) {
            if (form && !$scope.save_btn) {
                $scope.save_btn = true;
                if ($rootScope.settings.USER_USING_TO_LOGIN === 'email') {
                    $scope.user.email = $scope.user.username;
                    delete $scope.user.username;
                }
                usersLogin.login($scope.user, function(response) {
                     $scope.userLogin.$setPristine();
                     $scope.userLogin.$setUntouched();
                    $scope.response = response;
                    delete $scope.response.scope;
                    if ($scope.response.error.code === 0) {
                        $cookies.put('auth', JSON.stringify($scope.response), {
                            path: '/'
                        });
                        $cookies.put('token', $scope.response.access_token, {
                            path: '/'
                        });
                        $rootScope.$broadcast('updateParent', {
                            isAuth: true,
                            auth: $scope.response
                        });
                        /** quote_requests_factory Need to updated to register.js and below */
                        if ($cookies.get('quote_requests_factory') !== null && $cookies.get('quote_requests_factory') !== undefined && $scope.response.role_id !== ConstUserRole.Freelancer) {
                            var add_quote_request = $cookies.get('quote_requests_factory');
                            QuoteRequestsFactory.post(add_quote_request, function(response) {
                                $scope.response = response;
                                if ($scope.response.error.code === 0) {
                                    flash.set($filter("translate")("Quote request sent successfully."), 'success', false);
                                } else {
                                    $scope.user = {};
                                    flash.set($filter("translate")($scope.response.error.message), 'error', false);
                                }
                            });
                            $cookies.remove("quote_requests_factory", {
                                path: "/"
                            });
                            $uibModalStack.dismissAll();
                            $location.path('/');
                        } else {
                             flash.set($filter("translate")("As a Freelancer, couldn't send the service."), 'error', false);  
                            if ($cookies.get("redirect_url") !== null && $cookies.get("redirect_url") !== undefined) {
                                $uibModalStack.dismissAll();
                                $location.path($cookies.get("redirect_url"));
                                $cookies.remove("redirect_url", {
                                    path: "/"
                                });
                            } else {
                                $uibModalStack.dismissAll();
                                $location.path('/');
                            }
                        }
                    } else {
                        flash.set($filter("translate")($scope.response.error.message), 'error', false);
                        $scope.user = {};
                        $scope.save_btn = false;
                    }
                    $scope.getMyuser = function() {
                        if ($rootScope.isAuth) {
                            myUserFactory.get(function(response) {
                                $rootScope.my_user = response.data;
                                $rootScope.my_user_ammount = $scope.my_user;
                                    $rootScope.my_user_ammount.available_wallet_amount = Number
                                    ($rootScope.my_user_ammount.available_wallet_amount||0);
                            });
                        }
                    };
                    $scope.getMyuser();
                }, function(error) {
                    $scope.user = {};
                    flash.set($filter("translate")(error.data.error.message), 'error', false);
                    $scope.save_btn = false;
                });
            }
        };
    }]);