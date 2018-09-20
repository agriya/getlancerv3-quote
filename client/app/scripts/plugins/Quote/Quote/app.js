/*globals $:false */
'use strict';
/**
 * @ngdoc overview
 * @name getlancerApp
 * @description
 * # getlancerApp
 *
 * Main module of the application.
 */
angular.module('getlancerApp.Quote', [
    'getlancerApp.Quote.Constant',
    'ngResource',
    'ngSanitize',
    'satellizer',
    'ngAnimate',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'ui.router',
    'angular-growl',
    'google.places',
    'angular.filter',
    'ngCookies',
    'angular-md5',
    'ui.select2',
    'ui.select',
    'http-auth-interceptor',
    'vcRecaptcha',
    'angulartics',
    'pascalprecht.translate',
    'angulartics.google.analytics',
    'tmh.dynamicLocale',
    'ngMap',
    'chieffancypants.loadingBar',
    'payment',
    'builder',
    'builder.components',
    'validator.rules',
    'angularMoment',
    'ngFileUpload',
    '720kb.socialshare',
    'slugifier'
])
    .config(function($stateProvider, $urlRouterProvider) {
        var getToken = {
            'TokenServiceData': function(TokenService, $q) {
                return $q.all({
                    AuthServiceData: TokenService.promise,
                    SettingServiceData: TokenService.promiseSettings
                });
            }
        };
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('quote_services_filter', {
                url: '/quote_services/:user_id/:username?page&radius',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_services.html',
                resolve: getToken
            })
              .state('quote_my_services', {
                url: '/quote_services/my_services?q&page',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_my_services.html',
                resolve: getToken
              })
            .state('quote_services', {
                url: '/quote_services?page&radius&type?q',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_services.html',
                resolve: getToken,
                controller: 'QuoteServicesController'
            })
            .state('quote_service', {
                url: '/quote_service/:quoteServiceId/:slug',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_view.html',
                resolve: getToken,
                controller: 'QuoteServiceViewController'
            })
            .state('quote_service_add', {
                url: '/quote_service/add',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_add.html',
                resolve: getToken
            })
            .state('quote_services_user_list_edit', {
                url: '/user/quote_service/edit/:id',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_edit.html',
                resolve: getToken,
                controller: 'QuoteServiceEditController'
            })
            .state('quote_services_category', {
                url: '/service_category?page',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_categories.html',
                resolve: getToken,
                controller: 'QuoteServiceCategoriesController'
            })
            .state('quote_services_category_view', {
                url: '/service_category/:id/:slug?page',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_category.html',
                resolve: getToken,
                controller: 'QuoteServiceCategoryController'
            })
            .state('quote_services_category_view_services', {
                url: '/service_category/:id/services/:slug?page',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_category_services.html',
                resolve: getToken,
                controller: 'QuoteServiceCategoryServicesController'
            })
            .state('quote_services_faq', {
                url: '/quote_service_faqs/:quoteServiceId?page',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_services_faq_user.html',
                resolve: getToken,
                controller: 'QuoteServiceFaqsManageController'
            })
            .state('quote_request', {
                url: '/quote_request/:quoteServiceId/add',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_request.html',
                resolve: getToken
            })
            .state('quote_request_user_view', {
                url: '/quote_bids/my_requests/:requestId?type',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_request_view.html',
                resolve: getToken,
                controller: 'QuoteRequestViewController'
            })
            .state('quote_request_user_view_change', {
                url: '/quote_bids/my_requests/:requestId/:id?type',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_request_view.html',
                resolve: getToken,
                controller: 'QuoteRequestViewController'
            })
            .state('quote_request_user_view_filter', {
                url: '/quote_bids/my_requests/:requestId/:status/:statusname?type',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_request_view.html',
                resolve: getToken,
                controller: 'QuoteRequestViewController'
            })
            .state('quote_request_user_view_filter_change', { 
                url: '/quote_bids/my_requests/:requestId/:status/:statusname/:id?type',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_request_view.html',
                resolve: getToken,
                controller: 'QuoteRequestViewController'
            })
            .state('quote_my_works', {
                url: '/my_works',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_my_works.html',
                resolve: getToken,
                controller: 'QuoteMyWorksController'
            })
            .state('quote_my_works_filter', {
                url: '/my_works/:serviceid/:status/:statusname?type',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_my_works.html',
                resolve: getToken,
                controller: 'QuoteMyWorksController'
            })
            .state('quote_my_works_change', {
                url: '/my_works/:serviceid/:id',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_my_works.html',
                resolve: getToken,
                controller: 'QuoteMyWorksController'
            })
            .state('quote_my_works_filter_change', {
                url: '/my_works/:serviceid/:status/:statusname/:id',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_my_works.html',
                resolve: getToken,
                controller: 'QuoteMyWorksController'
            })
            /*  .state('quote_my_works_service_filter', {
                url: '/my_works/:status/:statusname/:serviceid',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_my_works.html',
                resolve: getToken,
                controller: 'QuoteMyWorksController'
            })*/
            .state('user_services', {
                url: '/business?page',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/user_services.html',
                resolve: getToken
            })
            .state('bussiness', {
                url: '/business/:user_id/:business_name?page&radius',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_services_business.html',
                resolve: getToken,
                controller: 'QuoteServicesBusinessController'
            })
            .state('quote_services_photo', {
                url: '/quote_service_photos/:quoteServiceId?page',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_photos_manage.html',
                resolve: getToken,
                controller: 'QuoteServicePhotosManageController'
            })
            .state('quote_services_video', {
                url: '/quote_service_videos/:quoteServiceId?page',
                templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_service_videos_manage.html',
                resolve: getToken,
                controller: 'QuoteServiceVideosManageController'
            });
    });