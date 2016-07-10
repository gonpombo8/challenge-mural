var app = angular.module('mural', ['ui.router', 'ngCookies']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'templates/username.html',
			controller: 'loginController'
		})
		.state('main', {
			templateUrl: 'templates/main.html',
			resolve: {
				username: function($cookies, $q) {
					var promise = $q.defer();
					$cookies.get('username') ? promise.resolve() : promise.reject('Auth error');
					return promise.promise;
				}
			}
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
	$urlRouterProvider.otherwise('/room1');
}]);

app.run(['$state', '$rootScope', function($state, $rootScope) {
	var LOGIN_ERROR = "Auth error";
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		event.preventDefault();
		if(error === LOGIN_ERROR) $state.go('login');
	});
}]);