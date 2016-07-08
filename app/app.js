angular
	.module('mural', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
			// For unmatched routes
			$urlRouterProvider.otherwise('/');
			$stateProvider
			.state('main', {
				templateUrl: 'templates/main.html'
			})
			.state('main.room1', {
				url: '/room1',
				templateUrl: 'templates/room1.html',
				controller: 'roomController'
			})
			.state('main.room2', {
				url: '/room2',
				templateUrl: 'templates/room2.html',
				controller: 'roomController'

			})
		}]);