'use strict';
app.controller('roomController', ['$state', '$scope', function($state, $scope) {
	var url            = window.location.protocol +  "//" + window.location.host;
	var socket         = io(url);
	var updatingScroll = false;
	var room           = $state.current.data.room;
	var timeout;

	//Scroll event.
	window.onscroll = function() {
		var scrollPercetage = window.pageYOffset / maxHeightScroll();
		if(!updatingScroll) socket.emit('scrollChange', {percentage: scrollPercetage, room: room});
	}
	//Another user scroll.
	socket.on('updateSroll', function(percentage) {
		var height = percentage * maxHeightScroll();
		updatingScroll = true;
		//Timeout function to doesn't send the data we recieve to the server when scrolling.
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			updatingScroll = false;
		}, 500);
		window.scrollTo(0, height);
	});

	//Height size of the app, use it to calculate percentage for multiple sizes of height.
	function maxHeightScroll() {
		var documentHeight = document.documentElement.scrollHeight;
		var windowHeight = window.innerHeight;
		return documentHeight - windowHeight;
	}

	(function init() {
		window.scrollTo(0, 0);
		socket.emit('room', room);
	})();

	//Remove listeners of socket when switching to another view, cause they acumulate if you don't destroy it on angularjs.
	$scope.$on('$destroy', function (event) {
		socket.removeAllListeners();
	});

}]);