"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
var fs = require("fs");
var salt = require('./cs142password.js');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

// XXX - Your submission should work without this line
// var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6', { useMongoClient: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.get('/', function (request, response) {
	response.send('Simple web server of files from ' + __dirname);
});

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */

// to pass server test, change debug to false
const debug = false;
function sessionNotFound(request) {
	if (debug) {
		request.session.loggedInUser = {login_name: "took", _id: "57231f1a30e4351f4e9f4bd9"};
	}
	return request.session.loggedInUser === undefined;
}

app.get('/test/:p1', function (request, response) {

	// Express parses the ":p1" from the URL and returns it in the request.params objects.
	console.log('/test called with param1 = ', request.params.p1);

	// default is 'info'
	var param = request.params.p1 || 'info';

	if (param === 'info') {
		// Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
		SchemaInfo.find({}, function (err, info) {
			if (err) {
				// Query returned an error.  We pass it back to the browser with an Internal Service
				// Error (500) error code.
				console.error('Doing /user/info error:', err);
				response.status(500).send(JSON.stringify(err));
				return;
			}
			if (info.length === 0) {
				// Query didn't return an error but didn't find the SchemaInfo object - This
				// is also an internal error return.
				response.status(500).send('Missing SchemaInfo');
				return;
			}

			// We got the object - return it in JSON format.
			console.log('SchemaInfo', info[0]);
			response.end(JSON.stringify(info[0]));
		});
	} else if (param === 'counts') {
		// In order to return the counts of all the collections we need to do an async
		// call to each collections. That is tricky to do so we use the async package
		// do the work.  We put the collections into array and use async.each to
		// do each .count() query.
		var collections = [
			{name: 'user', collection: User},
			{name: 'photo', collection: Photo},
			{name: 'schemaInfo', collection: SchemaInfo}
		];
		async.each(collections, function (col, done_callback) {
			col.collection.count({}, function (err, count) {
				col.count = count;
				done_callback(err);
			});
		}, function (err) {
			if (err) {
				response.status(500).send(JSON.stringify(err));
			} else {
				var obj = {};
				for (var i = 0; i < collections.length; i++) {
					obj[collections[i].name] = collections[i].count;
				}
				response.end(JSON.stringify(obj));
			}
		});
	} else {
		// If we know understand the parameter we return a (Bad Parameter) (400) status.
		response.status(400).send('Bad param ' + param);
	}
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', readUserList);
app.get('/user/list/:advanced', readUserList);
function readUserList(request, response) {
	console.log("app.get('/user/list/:advanced')");
	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}

	var advanced = request.params.advanced === 'true';
	console.log('/user/list/advanced', advanced);

	User.find({}, function(err, userList) {
		if (err) {
			// Query returned an error.  We pass it back to the browser with an Internal Service
			// Error (500) error code.
			console.error('User list error!', err);
			response.status(400).send({message: 'User list error!'});
			return;
		}
		if (userList.length === 0) {
			// Query didn't return an error but didn't find the SchemaInfo object - This
			// is also an internal error return.
			response.status(500).send({message: 'No user found!'});
			return;
		}
		var userListCopy = [];
		var id;

    userList = JSON.parse(JSON.stringify(userList));
		async.each(userList, function (user, callback) {
			id = user._id;
      var query = Photo.count({user_id: id});
      query.exec((err, count) => {
        user.photoCount = count;
				callback(); // must be placed in the callback
      })
		}, function(err) {
			if (err) {
				response.status(400).send(JSON.stringify(err));
				return;
			}
      console.log("Finished counting photos");

			// start counting comment
			var commentCount = {};
			Photo.find({}, (err, photoArr) => {
				photoArr = JSON.parse(JSON.stringify(photoArr));
				var photo;
				var comment;
				var commAuthor;

				// count comments for each user
				for (var i in photoArr) {
					photo = photoArr[i];
					for (var j in photo.comments) {
						comment = photo.comments[j];
						commAuthor = comment.user_id;
						if (commAuthor in commentCount) {
							commentCount[commAuthor] += 1;
						} else {
							commentCount[commAuthor] = 1;
						}
					}
				}

				// within Photo.find()'s callback,
				// add comment count to user object
				var user;
				for (var k in userList) {
					user = userList[k];
					user.commentCount = commentCount[user._id];
				}

				// check that both photos and authored comments are counted
				// console.log(userList);
				for (var l in userList) {
					userListCopy[l] = {_id: userList[l]._id,
						first_name: userList[l].first_name,
						last_name: userList[l].last_name,
						// login_name: userList[l].login_name,
						// password: userList[l].password
					};
					if (advanced) {
						userListCopy[l].photoCount = userList[l].photoCount;
						userListCopy[l].commentCount = userList[l].commentCount;
					}
				}
				console.log(userListCopy);
				response.end(JSON.stringify(userListCopy));
			}); // end Photo.find() callback
    });
	});
}

app.post('/admin/login', function (request, response) {
	const login_name = request.body.login_name;
	const password = request.body.password;
	console.log("Handdle request: /admin/login", login_name, password);
	User.findOne({login_name: login_name}, function(err, user) {

		if (err) {
			// Query returned an error. Error (500) error code.
			console.error('Err 400: User_id invalid!', err);
			response.status(400).send({message: 'User_id invalid!'});
			return;
		}

		if (user === null) {
				// user does not exist
				console.error('Err 400: User does not exist!', err);
				response.status(400).send({message: 'User does not exist!'});
				return;
		}

		if (salt.doesPasswordMatch(user.password_digest, user.salt, password)) {
			// stores some information in the Express session where it can be checked by
			// other request handlers that need to know whether a user is logged in.
			request.session.loggedInUser = user;
			console.log("200: Logged in user:", user);
			response.end(JSON.stringify(user));
		} else {
			console.log("Password incorrect");
			response.status(400).send({message: "Password incorrect"});
		}


	});
});

app.post('/user', function (request, response) {
	console.log("Handdle request: /user");
	const login_name = request.body.login_name;
	const password = request.body.password;

	var digest = salt.makePasswordEntry(password);

	const data = {
		login_name: login_name,
		password_digest: digest.hash,
		salt: digest.salt,
		first_name: request.body.first_name,
		last_name: request.body.last_name,
		location: request.body.location,
		description: request.body.description,
		occupation: request.body.occupation
	}

	console.log("Server received registration data:", data);
	User.findOne({login_name: login_name}, function(err, user) {
		if (err) {
			// Query returned an error.  We pass it back to the browser with an Internal Service
			// Error (500) error code.
			console.error('User_id invalid!', err);
			response.status(400).send({message: 'User_id invalid!'});
			return;
		}

		if (user !== null) {
			const message = 'User ' + login_name + ' already exists.';
			console.log(message);
			response.status(400).send({message: message});
			return;
		}

		User.create(data, function(err, newUser) {
			console.log(err, newUser);
			newUser.save();
			console.log("200: Created new user!", newUser);

			// automatically log in user after registration
			request.session.loggedInUser = newUser;
			response.status(200).send(JSON.parse(JSON.stringify(newUser)));
		});
	});
});

app.post('/admin/logout', function (request, response) {
	console.log("Handdle request: /admin/logout");
	const login_name = request.session.login_name;
	var message;
	if (sessionNotFound(request)) {
		message = "No session found for user.";
		console.log('Err 400:', message);
		response.status(400).send({message: message});
	} else {
		request.session.destroy(function (err) {
			if (err) {
				console.log("Error", err);
			}
			message = 'Logged out user: ' + login_name;
			console.log("200: ", message);
			response.status(200).send({message: message});
		});
	}
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
	console.log("app.get('/user/:id')");
	var message;
	if (sessionNotFound(request)) {
		message = "User is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}

	var id = request.params.id;
	User.findOne({_id: id}, function(err, user) {
		if (err) {
			// Query returned an error.  We pass it back to the browser with an Internal Service
			// Error (500) error code.
			console.error('User_id invalid!', err);
			response.status(400).send({message: 'User_id invalid!'});
			return;
		}

		if (user === null) {
			console.log('User with _id:' + id + ' not found.');
			response.status(400).send({message: 'User with _id:' + id + ' not found.'});
			return;
		}

		var copy = {_id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			location: user.location,
			description: user.description,
			occupation: user.occupation
		};
		response.status(200).send(JSON.stringify(copy));
	});
});

/*
 * URL /commentsOfPhoto/:photo_id - add comment for photo
 */
app.post('/commentsOfPhoto/:photo_id', function (request, response) {
	var id = request.params.photo_id;
	console.log("app.post('/commentsOfPhoto/:photo_id')", id);
	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
    return;
	}

	// reject any empty comments with a status of 400 (Bad request).
	if (request.body.comment === "") {
		console.log("Empty comment!");
		response.status(400).send({message: "Comment is empty."});
		return;
	}

	// simulate saving user in session
	// User.findOne({login_name: "took"}, function(err, user) {
	// 	// stores some information in the Express session where it can be checked by
	// 	// other request handlers that need to know whether a user is logged in.
	// 	console.log("Found user", user);
	// 	request.session.loggedInUser = user;

	Photo.findOne({_id: id}, function(err, photo) {
		if (err) {
			// Query returned an error.  We pass it back to the browser with an Internal Service
			// Error (500) error code.
			console.error('PhotoId invalid!', err);
			response.status(400).send({message: 'PhotoId invalid!'});
			return;
		}

		if (photo === null) {
			console.log('Photo with _id:' + id + ' not found.');
			response.status(400).send({message: 'Not found'});
			return;
		}

		var newComment = {
			comment: request.body.comment,
			user_id: request.session.loggedInUser._id,
			date_time: new Date()
		};
		photo.comments = photo.comments.concat([newComment]);
		console.log("photo", photo);
		photo.save();

		photo = JSON.parse(JSON.stringify(photo));
		async.each(photo.comments, function(comment, didProcessCommentsForPhoto){
			var commentatorId = comment.user_id;
			var commentator = User.findOne({_id: commentatorId});
			commentator.select("_id first_name last_name").exec(doneCallback);
			function doneCallback(err, commentator) {
				if (err) {
					response.status(400).send({message: 'User_id invalid!'});
					return;
				}
				if (commentator === null) {
					response.status(400).send({message: 'Not found'});
					return;
				}
				comment.user = commentator;
				delete comment.user_id;
				didProcessCommentsForPhoto();
				return;
			}
		}, function didProcessCommentsForPhoto(err) {
			if (err) {
				response.status(400).send({message: "Error!"});
				return;
			}
			console.log("Processed request /photo/:photoId");
			console.log(photo);
			response.status(200).send(JSON.stringify(photo));
		});
	});
});

app.get('/photo/:photoId', function (request, response) {
	console.log("app.get('/photo/:photoId')");
	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}

	var id = request.params.photoId;
	Photo.findOne({_id: id}, function(err, photo) {
		if (err) {
			// Query returned an error.  We pass it back to the browser with an Internal Service
			// Error (500) error code.
			console.error('PhotoId invalid!', err);
			response.status(400).send({message: 'PhotoId invalid!'});
			return;
		}

		if (photo === null) {
			console.log('Photo with _id:' + id + ' not found.');
			response.status(400).send({message: 'Photo with _id:' + id + ' not found.'});
			return;
		}

		photo = JSON.parse(JSON.stringify(photo));
		async.each(photo.comments, function(comment, didProcessCommentsForPhoto){
			// var commentCopy = JSON.parse(JSON.stringify(comment));
			var commentatorId = comment.user_id;
			var commentator = User.findOne({_id: commentatorId});
			commentator.select("_id first_name last_name").exec(doneCallback);
			function doneCallback(err, commentator) {
				if (err) {
					response.status(400).send({message: 'PhotoId invalid!'});
					return;
				}
				if (commentator === null) {
					response.status(400).send({message: 'Not found'});
					return;
				}
				comment.user = commentator;
				delete comment.user_id;
				didProcessCommentsForPhoto();
				return;
			}
		}, function didProcessCommentsForPhoto(err) {
			if (err) {
				response.status(400).send({message: "Error!"});
				return;
			}
			console.log("Processed request /photo/:photoId");
			console.log(photo);
			response.status(200).send(JSON.stringify(photo));
		});
	});
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}

	var id = request.params.id;
	var query = Photo.find({user_id: id});
	query.select("_id user_id comments file_name date_time")
	query.exec(didFetchPhotos);
	function didFetchPhotos(err, photos) {
		if (err) {
			// Query returned an error.  We pass it back to the browser with an Internal Service
			// Error (500) error code.
			console.error('User_id invalid!', err);
			response.status(400).send(JSON.stringify(err));
			return;
		}
		if (photos.length === 0) {
			// Query didn't return an error but didn't find the SchemaInfo object - This
			// is also an internal error return.
			response.status(500).send({message: 'No photo found.'});
			return;
		}
		var photosCopy = JSON.parse(JSON.stringify(photos));
		async.each(photosCopy, function(photo, callback) {
			async.each(photo.comments, function(comment, didProcessCommentsForPhoto){
				// var commentCopy = JSON.parse(JSON.stringify(comment));
				var commentatorId = comment.user_id;
				var commentator = User.findOne({_id: commentatorId});
				commentator.select("_id first_name last_name").exec(doneCallback);
				function doneCallback(err, commentator) {
					if (err) {
						response.status(400).send('User_id invalid!');
						return;
					}
					if (commentator === null) {
						response.status(400).send('Not found');
						return;
					}
					comment.user = commentator;
					delete comment.user_id;
					didProcessCommentsForPhoto();
					return;
				}
			}, function didProcessCommentsForPhoto(err) {
				if (err) {
					response.status(400).send("Error!");
					return;
				}
				console.log("INNER MAIN CALLBACK");
				callback();
			});
		}, function(err) {
			if (err) {
				response.status(400).send("Error!");
				return;
			}
			console.log("OUTER MAIN CALLBACK", photosCopy);
			console.log(JSON.stringify(photosCopy));
			response.status(200).send(JSON.stringify(photosCopy));
		});
	}
});

/*
 * URL /photos/new - upload and create new photo
 */
app.post('/photos/new', function(request, response) {
  console.log("app.post('/photos/new')", request.file);
  processFormBody(request, response, function (err) {
  if (err || !request.file) {
    console.log("Image failed to upload.");
    return;
  }

	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}

  // We need to create the file in the directory "images" under an unique name. We make
  // the original file name unique by adding a unique prefix with a timestamp.
  var timestamp = new Date().valueOf();
  var filename = 'U' +  String(timestamp) + request.file.originalname;

  fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
			if (err) {
				console.log("Error", err);
			}
			// XXX - Once you have the file written into your images directory under the name
			// filename you can create the Photo object in the database
      console.log("File has been saved!", filename);

      const data = {
        file_name: filename,
      user_id: request.session.loggedInUser._id, // The ID of the user who created the photo.
      comments: []
      }

      console.log(data);
      Photo.create(data, function(err, newPhoto) {
        console.log(err, newPhoto);
        newPhoto.save();
        console.log("200: Created new photo!", newPhoto);
        response.status(200).send('Created photo.');
      });
    });
  });
});

/*
 * URL /photosCommentedByUser/:id - extra credit: find list of photos commented by user
 */
app.get('/photosCommentedByUser/:id', function (request, response) {
	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}

	var id = request.params.id;
	var query = Photo.find();
	query.select("_id user_id comments file_name date_time")
	query.exec(didFetchPhotos);
	function didFetchPhotos(err, photos) {
		var validPhotos = [];
		var photo;
		photos = JSON.parse(JSON.stringify(photos));
		for (var i in photos) {
			photo = photos[i];
			for (var j in photo.comments) {
				if (photo.comments[j].user_id === id) {
					validPhotos.push(photo);
				}
			}
		}
		console.log(validPhotos);
		response.status(200).send(JSON.stringify(validPhotos));
	}
});

var server = app.listen(3000, function () {
	var port = server.address().port;
	console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
