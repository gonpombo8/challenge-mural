var app = angular.module('mural', ['ui.router']);
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('main', {
			templateUrl: 'templates/main.html'
		})
		.state('main.room1', {
			url: '/room1',
			templateUrl: 'templates/room1.html',
			controller: 'roomController',
			data: {
				room: 'room1'
			}
		})
		.state('main.room2', {
			url: '/room2',
			templateUrl: 'templates/room2.html',
			controller: 'roomController',
			data: {
				room: 'room2'
			}
		});
	$urlRouterProvider.otherwise('/');
}]);