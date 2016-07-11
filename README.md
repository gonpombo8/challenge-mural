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

### Log of decisions.

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


### Bonus points 1: 
> Do the math to coordinate both Windows when they have multiple sizes. 

I calculated the browser max height and stored it.

```javascript
function maxHeightScroll() {
	var documentHeight = document.documentElement.scrollHeight;
	var windowHeight = window.innerHeight;
	return documentHeight - windowHeight;
}
```
When the user scrolls, i get the scroll bar height position.
```javascript
window.pageYOffset
```
With this two variables, i can calculate the percentage of the scroll bar position, so another device with different resolution can see the same text part.
It only takes to multiplicate the percentage height with the browser total height, which is calculated with the maxHeightScroll function.
```javascript
	var height = scroll.percentage * maxHeightScroll();
```

### Bonus point 2
>How would you keep versioning on the database, if we wanted to store the last read position on each document (i.e. pick we're you've left). Research tech and describe the solution; no code required.

To keep the last read position of each document, i would use redis and mongodb.
It doesnt make sense to save all the height position sent by the user, because when the user starts scrolling it might send a lot of points. The last position is the only now that matters to be save, so i would use the scrollTimeout function previously declared to save the last position after not receiving data for 500ms.
I would save the scroll height and the document room on redis and mongodb. 
When an user connects, node will search on redis if that document has a height position and send it; if not query to mongodb, save the data fetch on redis and send it to the client.
I would use mongod because redis is an in-memory data structure store used as cache to speed up web application, so if redis server shutdown some data could be lost.

### Bonus point 3.
>How would you run this same app on multiple servers behind a Load Balancer? Research tech and describe the solution; no code required.


* Sticky Sessions.
Socket.io needs to talk continuously to the same server instance, so it works perfectly using only one instance.
Running the app behind a node balancer with multiple instances, would break socket.io because requests would be sent to different instances, which would break handshake protocol.
To solve this problem, load balancers have "sticky sessions". The concept of stick sessions is that all the client requests allways go to the same server instance.

* Redis Publisher/Subscribe service.

To broadcast events to everyone, or everyone in a room you’ll need to use redis pub/sub service to pass messages between processes or computers.
This service uses an adapter which is connected to redis.

```javascript
https://github.com/socketio/socket.io-redis
var redis = require('socket.io-redis');
io.adapter(redis({ host: host, port: port }))
```
