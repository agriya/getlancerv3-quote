'use strict';
/**
 * @ngdoc directive
 * @name getlancerApp.directive:QuoteServiceCategoryLists
 * @description
 * # QuoteServiceCategoryLists
 */
angular.module('getlancerApp.Quote')
	.directive('quoteActivities', function() {
        return {
            templateUrl: 'scripts/plugins/Quote/Quote/views/default/quote_activities.html',
            restrict: 'EA',
            //replace: 'true',
			scope: {
				quoteId: "@",
                bidId: "@",
          	},
            controller: ('quoteActivitiesCtrl', function($rootScope, QuoteActivitiesFactory, md5, $window, ActivityType, $scope, $state, ConstUserRole, MeQuoteActivitiesFactory) {
               var params = {
                    activity_type: '10,11',
                    foreign_id: $scope.bidId,
                    class: 'QuoteBid'
                }; 
				$rootScope.quote_my_works = function(type)
				{
					if(type ===  'update')
					{
						if($rootScope.user.role_id !== ConstUserRole.Admin)
						{
					$scope.quote_activities = [];
					MeQuoteActivitiesFactory.get(params, function(response) {
					if (angular.isDefined(response.data)) {
						if (angular.isDefined(response._metadata)) {
							$scope.messageNoOfPages = response._metadata.last_page;
							$scope.messageTotal = response._metadata.total - (response._metadata.current_page * response._metadata.per_page );
						}
						angular.forEach(response.data, function (value) {
							if (angular.isDefined(value) && value !== null) {
								
								if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 1 && value.to_status_id == 2) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' submitted the quote. Quote amount '+ $rootScope.settings.CURRENCY_SYMBOL + value.amount + '.';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = 'images/default.png';
									}
								} else if((value.activity_type == ActivityType.QuoteBidAmountChanged)) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' updated the quote. New Quote amount '+ $rootScope.settings.CURRENCY_SYMBOL +  value.amount + '.';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 2 && value.to_status_id == 3) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' get hired for this job';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 3 && value.to_status_id == 4) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' completed this job';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 4 && value.to_status_id == 6) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_user.id + '/' + value.foreign.activity.foreign_user.username + '>' + value.foreign.activity.foreign_user.username + '</a>' + ' accepted this job and closed';
									
									if (angular.isDefined(value.foreign.activity.foreign_user.foreign_attachment) && value.foreign.activity.foreign_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_user.foreign_attachment.class + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 4 && value.to_status_id == 7) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_user.id + '/' + value.foreign.activity.foreign_user.username + '>' + value.foreign.activity.foreign_user.username + '</a>' + ' rejected this job done and marked as not completed status';
									
									if (angular.isDefined(value.foreign.activity.foreign_user.foreign_attachment) && value.foreign.activity.foreign_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_user.foreign_attachment.class + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.to_status_id == 5) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' ignored this quote requests';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								}
							}
								$scope.quote_activities.push(value);
						});
                	   }
		              });
				  }else{
					  $scope.quote_activities = [];
					QuoteActivitiesFactory.get(params, function(response) {
					if (angular.isDefined(response.data)) {
						if (angular.isDefined(response._metadata)) {
							$scope.messageNoOfPages = response._metadata.last_page;
							$scope.messageTotal = response._metadata.total - (response._metadata.current_page * response._metadata.per_page );
						}
						angular.forEach(response.data, function (value) {
							if (angular.isDefined(value) && value !== null) {
								
								if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 1 && value.to_status_id == 2) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' submitted the quote. Quote amount '+ $rootScope.settings.CURRENCY_SYMBOL + value.amount + '.';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = 'images/default.png';
									}
								} else if((value.activity_type == ActivityType.QuoteBidAmountChanged)) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' updated the quote. New Quote amount '+ $rootScope.settings.CURRENCY_SYMBOL +  value.amount + '.';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 2 && value.to_status_id == 3) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' get hired for this job';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 3 && value.to_status_id == 4) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' completed this job';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 4 && value.to_status_id == 6) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_user.id + '/' + value.foreign.activity.foreign_user.username + '>' + value.foreign.activity.foreign_user.username + '</a>' + ' accepted this job and closed';
									
									if (angular.isDefined(value.foreign.activity.foreign_user.foreign_attachment) && value.foreign.activity.foreign_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_user.foreign_attachment.class + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 4 && value.to_status_id == 7) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_user.id + '/' + value.foreign.activity.foreign_user.username + '>' + value.foreign.activity.foreign_user.username + '</a>' + ' rejected this job done and marked as not completed status';
									
									if (angular.isDefined(value.foreign.activity.foreign_user.foreign_attachment) && value.foreign.activity.foreign_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_user.foreign_attachment.class + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.to_status_id == 5) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' ignored this quote requests';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								}
							}
								$scope.quote_activities.push(value);
						});
                	   }
		              });
				  }
				}else{
					if($rootScope.user.role_id !== ConstUserRole.Admin){
					$scope.quote_activities = [];
						MeQuoteActivitiesFactory.get(params, function(response) {
					if (angular.isDefined(response.data)) {
						if (angular.isDefined(response._metadata)) {
							$scope.messageNoOfPages = response._metadata.last_page;
							$scope.messageTotal = response._metadata.total - (response._metadata.current_page * response._metadata.per_page );
						}
						angular.forEach(response.data, function (value) {
							if (angular.isDefined(value) && value !== null) {
								
								if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 1 && value.to_status_id == 2) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' submitted the quote. Quote amount '+ $rootScope.settings.CURRENCY_SYMBOL + value.amount + '.';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = 'images/default.png';
									}
								} else if((value.activity_type == ActivityType.QuoteBidAmountChanged)) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' updated the quote. New Quote amount '+ $rootScope.settings.CURRENCY_SYMBOL +  value.amount + '.';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 2 && value.to_status_id == 3) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' get hired for this job';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 3 && value.to_status_id == 4) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' completed this job';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 4 && value.to_status_id == 6) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_user.id + '/' + value.foreign.activity.foreign_user.username + '>' + value.foreign.activity.foreign_user.username + '</a>' + ' accepted this job and closed';
									
									if (angular.isDefined(value.foreign.activity.foreign_user.foreign_attachment) && value.foreign.activity.foreign_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_user.foreign_attachment.class + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 4 && value.to_status_id == 7) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_user.id + '/' + value.foreign.activity.foreign_user.username + '>' + value.foreign.activity.foreign_user.username + '</a>' + ' rejected this job done and marked as not completed status';
									
									if (angular.isDefined(value.foreign.activity.foreign_user.foreign_attachment) && value.foreign.activity.foreign_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_user.foreign_attachment.class + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.to_status_id == 5) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' ignored this quote requests';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								}
							}
								$scope.quote_activities.push(value);
						});
                	   }
		              });
				   }else{
					   $scope.quote_activities = [];
						QuoteActivitiesFactory.get(params, function(response) {
					if (angular.isDefined(response.data)) {
						if (angular.isDefined(response._metadata)) {
							$scope.messageNoOfPages = response._metadata.last_page;
							$scope.messageTotal = response._metadata.total - (response._metadata.current_page * response._metadata.per_page );
						}
						angular.forEach(response.data, function (value) {
							if (angular.isDefined(value) && value !== null) {
								
								if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 1 && value.to_status_id == 2) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' submitted the quote. Quote amount '+ $rootScope.settings.CURRENCY_SYMBOL + value.amount + '.';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = 'images/default.png';
									}
								} else if((value.activity_type == ActivityType.QuoteBidAmountChanged)) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' updated the quote. New Quote amount '+ $rootScope.settings.CURRENCY_SYMBOL +  value.amount + '.';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 2 && value.to_status_id == 3) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' get hired for this job';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 3 && value.to_status_id == 4) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' completed this job';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 4 && value.to_status_id == 6) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_user.id + '/' + value.foreign.activity.foreign_user.username + '>' + value.foreign.activity.foreign_user.username + '</a>' + ' accepted this job and closed';
									
									if (angular.isDefined(value.foreign.activity.foreign_user.foreign_attachment) && value.foreign.activity.foreign_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_user.foreign_attachment.class + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.from_status_id == 4 && value.to_status_id == 7) {
									
									value.message = '<a href =users/' + value.foreign.activity.foreign_user.id + '/' + value.foreign.activity.foreign_user.username + '>' + value.foreign.activity.foreign_user.username + '</a>' + ' rejected this job done and marked as not completed status';
									
									if (angular.isDefined(value.foreign.activity.foreign_user.foreign_attachment) && value.foreign.activity.foreign_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_user.foreign_attachment.class + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								} else if(value.activity_type == ActivityType.QuoteBidStatusChanged && value.to_status_id == 5) {
									 
									value.message = '<a href =users/' + value.foreign.activity.foreign_service_provider_user.id + '/' + value.foreign.activity.foreign_service_provider_user.username + '>' + value.foreign.activity.foreign_service_provider_user.username + '</a>' + ' ignored this quote requests';
									
									if (angular.isDefined(value.foreign.activity.foreign_service_provider_user.foreign_attachment) && value.foreign.activity.foreign_service_provider_user.foreign_attachment !== null) {
									var hash = md5.createHash(value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + 'png' + 'small_thumb');
									value.image_name = 'images/small_thumb/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.class + '/' + value.foreign.activity.foreign_service_provider_user.foreign_attachment.foreign_id + '.' + hash + '.png';
									} else {
										value.image_name = $window.theme + 'images/default.png';
									}
								}
							}
								$scope.quote_activities.push(value);
						});
                	   }
		              });
				   }
				}
				}
				$rootScope.quote_my_works();
    		})
        };
    })