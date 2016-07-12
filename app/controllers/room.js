'use strict';
app.controller('roomController', ['$state', '$scope', '$cookies', function($state, $scope, $cookies) {
	var url            = window.location.protocol +  "//" + window.location.host;
	var socket         = io(url);
	var updatingScroll = false;
	var room           = $state.current.data.room;
	var WIDTH          = 0;
	var timeout;

	window.onscroll = function() {
		var scrollPercetage = window.pageYOffset / maxHeightScroll();
		if(!updatingScroll) socket.emit('scrollChange', {percentage: scrollPercetage, room: room});
	}

	socket.on('updateSroll', function(scroll) {
		var height = scroll.percentage * maxHeightScroll();
		notifyMessage(scroll.username);
		scrollTimeout();
		window.scrollTo(WIDTH, height);
	});

	socket.on('error', function(error) {
		$.notify(error, "danger");
		$state.go('login');
	});

	function scrollTimeout() {
		updatingScroll = true;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			updatingScroll = false;
		}, 500);
	}

	function maxHeightScroll() {
		var documentHeight = document.documentElement.scrollHeight;
		var windowHeight = window.innerHeight;
		return documentHeight - windowHeight;
	}

	function notifyMessage(username) {
		if(username) {
			var oldMessage = $("[data-notify-text]");
			var message = username + " is scrolling";
			oldMessage.length ? oldMessage.html(message) : $.notify(message);
		}
	}

	(function init() {
		socket.emit('initRoom', room, function(scroll) {
			scrollTimeout();
			window.scrollTo(WIDTH, scroll.percentage * maxHeightScroll());
		});
	})();

	$scope.$on('$destroy', function (event) {
		socket.removeAllListeners();
	});

}]);