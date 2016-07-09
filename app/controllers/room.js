'use strict';
app.controller('roomController', ['$state', '$scope', function($state, $scope) {
	var url            = window.location.protocol +  "//" + window.location.host;
	var socket         = io(url);
	var updatingScroll = false;
	var room           = $state.current.data.room;
	var timeout;

	socket.emit('room', room);

	window.onscroll = function() {
		var scrollPercetage = window.pageYOffset / maxHeightScroll();
		if(!updatingScroll) socket.emit('scrollChange', {percentage: scrollPercetage, room: room});
	}

	socket.on('updateSroll', function(percentage) {
		var height = percentage * maxHeightScroll();
		updatingScroll = true;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			updatingScroll = false;
		}, 500);
		window.scrollTo(0, height);
	});

	function maxHeightScroll() {
		var documentHeight = document.documentElement.scrollHeight;
		var windowHeight = window.innerHeight;
		return documentHeight - windowHeight;
	}

	$scope.$on('$destroy', function (event) {
		socket.removeAllListeners();
	});

}]);