var app = angular.module('mural', ['ui.router', 'ngCookies']);

app.run(['$state', '$rootScope', function($state, $rootScope) {
	$.notify.defaults({autoHideDelay: 4000, className: 'success'});
	var LOGIN_ERROR = "Auth error";
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		event.preventDefault();
		if(error === LOGIN_ERROR) $state.go('login');
	});
}]);