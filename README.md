Challenge MURAL.co
============

### Synopsis
> Tech challenge for mural.co by Gon Pombo.
> Simple real-time app where the users can read different documents collaboratively.

### Installation
```sh
$ git clone git@github.com:gonpombo8/challenge-mural.git challenge
$ cd challenge
$ npm install 
$ gulp serve
```

### Demo.
> You can access to demo preview on https://mural-challenge.herokuapp.com/#/

### Bonus Point 1

### Bonus Point 2

### Bonus Point 3

### Log of the most important decisions.

I decided to use expressJS to serve front-end files, like the bower_components, javascript controllers and templates.
At first, i started using jquery to write the client to make it faster. Then i refactored the code and migrated it to AngularJS, where i am more confortable.
The first approach is when a user scrolls a document, jasvascript catchs this event (window.onscroll), and then sends to Nodejs the height of the scroll bar (window.pageYOffset). Also when the user receives a height position from the back-end, it will see the scrollbar updated by javascript (window.scrollTo(x, y)).
It was an issue that when the user scrolled, the rest of the users were placed in that position. But when this happened the window.onscroll event was called again on each client, so they were sending duplicate information, which was irrelevant.

```javascript
window.onscroll =>
if(!updatingScroll) socket.emit('scrollChange', {percentage: scrollPercetage, room: room});
```

If the user was receiving information, updatingScrollbar is set to true, so it doesn't send again.
After 500 ms of not receiving nothing, it will change to false, and the socket.emit event is available again
socket.on =>

```javascript
function scrollTimeout() {
	updatingScroll = true;
	clearTimeout(timeout);
	timeout = setTimeout(function() {
		updatingScroll = false;
	}, 500);
}
```

I created rooms, so more than one document could be read collaboratively, and used socket.io rooms to manage the documents independently. I decided to use rooms instead of namespaces, to make it transparent to nodejs if you have one document or N. To create a new document you only need to add a template on angularjs and config the route.

I used cookies to store the username to indentify who scrolls the document. This username cookie is sent trought socket.headers.

If a user joins the session and there's another user connected, nodejs sends the connected user's positon. I stored the scroll position in memory (var scrollTest) as it only has one cluster and one instance. Another way would be to request the connected user position with sockets and send it to the new user; or store it on redis and mongodb.
