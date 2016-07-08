'use strict';
$(document).ready(() => {
	var socket = io();
	var timeout;
	var updatingScroll = false;

	
	socket.on('updateSroll', (percentage) => {
		let height = percentage * maxHeightScroll();
		updatingScroll = true;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			updatingScroll = false;
		}, 500);
		$(window).scrollTop(height);
	});

	$(window).scroll(() => {
		let scrollPercetage = window.pageYOffset / maxHeightScroll();
		if(!updatingScroll) socket.emit('scroll', scrollPercetage);
	});

	function maxHeightScroll() {
		return $(document).height() - $(window).height();
	}
});