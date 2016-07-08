'use strict';
angular
	.module('mural')
	.controller('roomController', ['$state', '$scope', function($state, $scope) {
		var socket         = io();
		var updatingScroll = false;
		var room           = $state.current.data.room;
		var timeout;

		socket.emit('room', room);

		window.onscroll = function() {
			let scrollPercetage = window.pageYOffset / maxHeightScroll();
			if(!updatingScroll) socket.emit('scroll', scrollPercetage);
		}

		socket.on('updateSroll', function(percentage) {
			let height = percentage * maxHeightScroll();
			updatingScroll = true;
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				updatingScroll = false;
			}, 500);
			window.scrollTo(0, height);
		});

		function maxHeightScroll() {
			let documentHeight = document.documentElement.scrollHeight;
			let windowHeight = window.innerHeight;
			return documentHeight - windowHeight;
		}

		$scope.$on('$destroy', function (event) {
			socket.removeAllListeners();
		});

	}]);