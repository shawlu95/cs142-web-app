### Week 6
#### NodeJS ([NodeJS.pdf](NodeJS.pdf))
*Lecture on May 3, 6, 8*
* Thread switching and event queue
* Serve has one event loop; a single thread.
* Each module has its own name scope (not combined together in a `window` scope) (page 6).
* To import a module: `var fs = require("fs");` (can import custom file, system module, `index.js` from a directory).
* To call a module's function: `fs.readFile(...);`
* To declare global variable: `module.exports = {key : val...};`
* NodeJS has vast libraries of modules. In this course we use `Express` for HTTP and `Mongoose` for database management.
* Node buffer class (page 8).
* Node.js exits when no callbacks are outstanding (page 10).
* Event-based programming is different from thread-based (page 11):
    - Anything that may block must call with a callback.
    - If it doesn't block, just call it like a normal function.

```JavaScript
// step 1 returns r1
step1(function(r1) {
    console.log('step1 done', r1);
    // step 2 returns r2
    step2(r1, function (r2) {
        console.log('step2 done', r2);
        // step 3 returns r3
        step3(r2, function (r3) {
            console.log('step3 done',r3);
        });
    });
});

// Wrong! Printed immediately
console.log('All Done!');
```

##### Listener/Emitter Pattern (page 14)
* Listeners: called when emitter calls.
* Emitter: calls all registered listeners.
* In DOM, can add event listener to mouse key, input text field etc.
* In Node, DOM is not available -> must manage both listening `on()` and emitting `emit()`.
* `on()` must register callback function.
* `emit()` can pass parameters to callback function.

```JavaScript
myEmitter.on('myEvent', function(param1, param2) {
    console.log('myEvent occurred with ' + param1 + ' and ' + param2 + '!');
});

myEmitter.emit('myEvent', 'arg1', 'arg2');
```
*  ``emitterOne.emit(event1)``only calls ``emitterOne.on('event1', function(){...})`` and cannot deal with ``emitterTwo.on('event1', function(){...})``

##### Stream (page 17)
Reading file as stream is helpful when file is too large to load into memory.
* Read Stream:
    - Each time a packet arrives, call `'data'` event. Each packet has its own `chunkBuffer` instead of a global buffer for entire file. If the file is big enough, the stream will come several times in multiple chunks
    - When stream ends, call `'end'` event. (or "finish")
    - If the file is empty, it will not trigger the "data" event but will go to the "end" event directly.
*  Writable streams:
    - Each time a packet needs to be saved, use `write()` method.
    - When writing finishes, call `'finish'` event.
* Study code example:
```JavaScript
fs.createReadStream(...) // (page 18).
fs.createWriteStream(...) //(page 19).
```

##### Code Study: Chatbot
```JavaScript
var clients = []; // List of connected clients
function processTCPconnection(socket) {
	clients.push(socket); // Add this client to our connected list
socket.on('data', function (data) {
broadcast( "> " + data, socket); // Send received data to all
	});
	socket.on('end', function () {
		clients.splice(clients.indexOf(socket), 1); // remove socket
	});
}

// Send message to all clients
function broadcast(message, sender) {
	clients.forEach(function (client) {
		if (client === sender) return; // Don't send it to sender client.write(message);
	});
}
```

##### Code Study: File Server
```JavaScript
net.createServer(function (socket) {
    // fileName is being listened to
    socket.on('data', function (fileName) {
        // fileName is a buffer, needs to convert to string
        // readFile function pass error and fileData params to callback
        fs.readFile(fileName.toString(), function (error, fileData) {
            if (!error) {
                 socket.write(fileData);  // Writing a Buffer
            } else {
                 socket.write(error.message); // Writing a String
            }
            socket.end();
        });
    });
}).listen(4000);
```

##### Handy Syntax: Loop
To perform identical operation on each element in an array, use `array.forEach(function (element) {...});`. One example is in the chatbot `broadcast` function. For ahother example:

```JavaScript
var fileContents = {};
['f1','f2','f3'].forEach(function (fileName) {
    // in the call beck, place content in dictionary if successfully read
	fs.readFile(fileName, function (error, dataBuffer) {
		assert(!error);
		fileContents[fileName] = dataBuffer;
	});
});
```

##### A Common Pattern: Turning Waiting into a Callback
```JavaScript
var fileContents = {};
async.each(['f1','f2','f3'], readIt, function (err) {
	if (!err) console.log('Done'); // fileContents filled in
	if (err) console.error('Got an error:', err.message);
});
function readIt(fileName, callback) {
	fs.readFile(fileName, function (error, dataBuffer) {
		fileContents[fileName] = dataBuffer;
		callback(error);
	});
}
```
___
#### Express ([Express.pdf](Express.pdf))
*Lecture on May 8, 10*
* **Un-opinionated**: speak HTTP, and doesn't care about what language (Ruby, JavaScript, Python) communicates with it.
  - Speak HTTP (accept TCP connection, process HTTP request, send HTTP response)
  - Routing (Map URL to web server functions that use such URL)
  - Middleware support (can add custom support for cookies, sessions, security, etc.)

* Express module has well-defined HTTP methods. Each method takes a `url` path and `requestProcessFunction` as parameters.

```JavaScript
var express = require("express");
var app = express();
app.get("/user/list", readUserList);
function readUserList(request, response) {
	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		response.status(401).send({message: message});
		return;
	}
  message = "Hello";
  response.end(JSON.stringify({message: message}));
  // send can deal with objects while end only deals with strings (so JSON.stringify is needed)

  app.listen(3000);
```

* `requestProcessFunction` takes parameters: `httpRequest`, `httpResponse` and (optional) `next` (page 5, 6).
* Middleware (page 7).
    * Middleware `next` is defined per url.
    * To interpose middleware to all requests, use `expressApp.use(function (request, response, next) {...});`
* Response data may not be available when request arrives.
    * Make sure you always call `end()` or `send()`
    * Can send response in callback.
    * JSON is popular enough to warrant a method `response.json(obj);` that directly JSON-encode an object into the response object.

##### Code study: multiple models
For each object, schedule a call back. Note that `comment` array is not populated in the order of the loop.

```JavaScript
app.get("/commentsOf/:objid", function (request, response) {
	var comments = [];
	fs.readFile("DB" + request.params.objid, function (error, contents) {
		var obj = JSON.parse(contents);
		async.each(obj.comments, fetchComments, allDone);
	});

	function fetchComments(commentFile, callback) {
		fs.readFile("DB"+ commentFile, function (error, contents) {
			if (!error) comments.push(JSON.parse(contents));
			callback(error);
		});
	}
	function allDone(error) {
		if (error) responses.status(500).send(error.message); else response.json(comments);
	}
}
```

___
#### [Database.pdf](Database.pdf)
*Lecture on May 10*

##### Relational Database
* Data are stored in table(also called relations).
* Schema defines structure of table.
* ORM

```SQL
CREATE TABLE Users (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    location VARCHAR(20)
);
```

* Table contains rows.
* Rows are sets of typed columns.

##### SQL
* SELECT: `SELECT * from Users WHERE id = 2;`
* UPDATE: `UPDATE Users SET location = 'New York, NY' WHERE id = 2;`
* INSERT:

```SQL
INSERT INTO Users (
   first_name,
   last_name,
   location)
   VALUES
   ('Ian',
   'Malcolm',
   'Austin, TX');
```

* DELETE: `DELETE FROM Users WHERE last_name='Malcolm';`
* INDEX: a data structure that finds a row quickly (not free):
    - scanning data takes O(n) time; index lookup takes O(log(n))
    - **primary key**: defined for each table; must be unique.

##### Object Relational Mapping (ORM)
ORM converts object to table row and row to object. Modify object properties, and the object takes directly to database.
**Rail**: second generation web frameworks.
    * a class is defined for each table.
    * Object of class is like row in table.

#####  NoSQL - MongoDB ([Intro](https://www.mongodb.com/nosql-inline))
* Relational DB are useful in the past, when storage was expensive, datasets were small and queries were not heavy.
* Today's storage is cheap, data are big, and queries are intensive -> need NoSQL.

Advantages of NoSQL
* Dynamic schema: allow the insertion of data without a predefined schema; do not need to be defined before ingesting data (SQL schema fits poorly with agile development approach).
* Horizontal scaling: adding more nodes. SQL is **designed for** vertical scaling, a single super computer that hosts the entire dataset (sharding SQL requires complex coordinating logic).

| NoSQL Database Types | Overview |
|----------------------|--------------------------------------------------|
|Key-value stores      | The simplest NoSQL databases. Every single item in the database is stored as an attribute name, or key, together with its value. Examples of key-value stores are `Riak` and `Voldemort`. Some key-value stores, such as `Redis`, allow each value to have a type, such as "integer", which adds functionality. |
| Document databases   | Pairing each key with a complex data structure known as a document. Documents can contain many different key-value pairs, or key-array pairs, or even nested documents. |
|Wide-column stores    | e.g. `Cassandra` and `HBase` are optimized for queries over large datasets, and store **columns of data** together, instead of rows. |
| Graph stores         | Used to store information about networks, such as social connections. Graph stores include `Neo4J` and `HyperGraphDB`. |

##### Mongoose
Connect and listen to DB (page 13).

```JavaScript
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cs142');

mongoose.connection.on('open', function ()  {
   // Can start processing model fetch requests
});

mongoose.connection.on('error', function (err) { });
```

##### Enforce schema (page 14).

```JavaScript
var userSchema = new mongoose.Schema({
   first_name: String,
   last_name: String,
   emailAddresses: [String], // array of string
   location: String
});

// option: index
first_name: {type: 'String', index: true}

// option: unique index
user_name: {type: 'String', index: {unique: true} }

// option: assign default value
date: {type: Date, default: Date.now }
```

##### Create object (page 17).

```JavaScript
var User = mongoose.model('User', userSchema);
User.create({ first_name: 'Ian', last_name: 'Malcolm'}, doneCallback);

function doneCallback(err, newUser) {
  assert (!err);
  console.log('Created object with ID', newUser._id);
}
```

##### Operation on model (page 18).

```JavaScript
// find all users
User.find(function (err, users) {/*users is an array of objects*/ });

// find one user and operates on the user
User.findOne({_id: user_id}, function (err, user) {
  // Update user object - (Note: Object is "special")
  // user is not an ordinary JS object
  // cannot add properties as desired
  user.save();
});
```

##### Query builder (page 19).

```JavaScript
var query = User.find({});
query.select("first_name last_name").exec(doneCallback);
query.sort("first_name").exec(doneCallback);
query.limit(50).exec(doneCallback);
query.sort("-location").select("first_name").exec(doneCallback);
```

##### Deletion (page 20).

```JavaScript
// delete user by id
User.remove({_id: user_id}, function (err) { } );

// delete all users
User.remove({}, function (err) { } );
```
