app.controller('loginController', ['$scope', '$cookies', '$state', function($scope, $cookies, $state) {
	$scope.username = $cookies.get('username') || "";
	$scope.signin = function() {
		if($scope.username) $cookies.put('username', $scope.username);
		$state.go('main.room1');
	}
}]);