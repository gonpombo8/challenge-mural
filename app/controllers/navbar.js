app.controller('navbarController', ['$scope', '$cookies', function($scope, $cookies) {
	$scope.username = $cookies.get('username');
}]);