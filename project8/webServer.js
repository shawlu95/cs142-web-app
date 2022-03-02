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

var async = require('async');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
var fs = require("fs");
var salt = require('./cs142password.js');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/cs142project6', { useMongoClient: true });

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');
var Activity = require('./schema/activity.js');
var express = require('express');
var app = express();

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
const debug = true;
function sessionNotFound(request) {
	if (debug === true && request.session.loggedInUser === undefined) {
		request.session.loggedInUser = {login_name: "zheng", _id: "57231f1a30e4351f4e9f4bdd", first_name: "Tingyu"};
	}
	return request.session.loggedInUser === undefined;
}

function logActivity(data) {
	Activity.create(data, function(err, newActivity) {
		console.log("!!!!!", err, newActivity);
		newActivity.save();
	});
}

/*
 * URL /photos/like/:user_id/:photo_id - like a photo
 */
app.post('/photos/like/:user_id/:photo_id', function(request, response) {
	const photo_id = request.params.photo_id;
	const user_id = request.params.user_id;
	console.log('/like ', request.params.user_id, request.params.photo_id);
	Photo.findOne({_id: photo_id}, (err, photo) => {
		photo.likes = photo.likes.concat([{user_id: user_id}]);
		photo.save((err) => {
			console.log(err);
			console.log(photo);
			response.status(200).send();
		});
	});
});

/*
 * URL/photos/unlike/:user_id/:photo_id - unlike a photo
 */
app.post('/photos/unlike/:user_id/:photo_id', function(request, response) {
	const photo_id = request.params.photo_id;
	const user_id = request.params.user_id;
	console.log('/unlike ', request.params.user_id, request.params.photo_id);
	Photo.findOne({_id: photo_id}, (err, photo) => {
		var likes = JSON.parse(JSON.stringify(photo.likes));
		for (var i in likes) {
			if (likes[i].user_id === user_id) {
				photo.likes.splice(i, 1);
				photo.save(err => {
					console.log(err);
					console.log(photo);
					response.status(200).send();
				});
			}
		}
	});
});

app.post("/photos/favorite/:user_id/:photo_id", function(request, response) {
	const photo_id = request.params.photo_id;
	const user_id = request.params.user_id;
	User.findOne({_id: user_id}, (err, user) => {
		console.log(user);
		user.favorites = user.favorites.concat([{photo_id: photo_id}]);
		user.save(err => {
			if (err) throw err;
			console.log(user);
			response.status(200).send(JSON.parse(JSON.stringify(user)));
		});
	});
});

app.post("/photos/unfavorite/:user_id/:photo_id", function(request, response) {
	const photo_id = request.params.photo_id;
	const user_id = request.params.user_id;
	console.log("/photos/unfavorite/:user_id/:photo_id", user_id, photo_id);
	console.log(photo_id);
	User.findOne({_id: user_id}, (err, user) => {
		var favorites = JSON.parse(JSON.stringify(user.favorites));
		console.log(favorites);
		for (var i in favorites) {
			if (favorites[i].photo_id === photo_id) {
				user.favorites.splice(i, 1);
				user.save(err => {
					console.log(err, user);
					response.status(200).send();
				});
			}
		}
	});
});
/*
 * URL /test/:p1 -
 */
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
app.get('/user/list/mentions', function(request, response) {
	const properties = "_id first_name last_name";
	User.find().select(properties).sort({date_time: -1}).exec(function(err, users) {
		users = JSON.parse(JSON.stringify(users));
		console.log(users);
		response.status(200).send(users);
	});
});

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

/*
 * URL /siteActivities - Return 5 most recent activities.
 */
app.get('/siteActivities', function (request, response) {
	console.log('/siteActivities');
	// check if user is logged in
	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}

	// read 5 most recent activities
	Activity.find({}).sort({date_time: -1}).limit(5).exec(function (err, activities) {
		if (err) {
			message = "Failed to read activities.";
			console.log(message);
			response.status(400).send({message: message});
			return;
		}
		activities = JSON.parse(JSON.stringify(activities));
		async.each(activities, function(activity, callback) {
			var user_id = activity.user_id;
			var user = User.findOne({_id: user_id});
			user.select("_id first_name last_name").exec(doneCallback);
			function doneCallback(err, user) {
				activity.user = user;
				delete activity.user_id;
				callback();
				return;
			}
		}, function callback(err) {
			if (err) {
				response.status(400).send({message: "Error!"});
				return;
			}
			console.log(activities);
			response.status(200).send(activities);
		});
	});
});

/*
 * URL /user - Register new user
 */
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
			// log activity, independent of response
      logActivity({user_id: newUser._id, activity: "REGISTER"});

			console.log(err, newUser);
			newUser.save();
			console.log("200: Created new user!", newUser);

			// automatically log in user after registration
			request.session.loggedInUser = newUser;

			newUser = JSON.parse(JSON.stringify(newUser));
			newUser.mostRecent = null;
			newUser.mostCommented = null;
			response.status(200).send(newUser);
		});
	});
});

/*
 * URL /admin/login - Login with password. Throw err if user exists
 */
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

		var payload = JSON.parse(JSON.stringify(user));
		payload.mostRecent = null;
		payload.mostCommented = null;

		if (salt.doesPasswordMatch(user.password_digest, user.salt, password)) {

			logActivity({
        user_id: user._id,
				activity: "LOGIN"
			});

			// stores some information in the Express session where it can be checked by
			// other request handlers that need to know whether a user is logged in.
			request.session.loggedInUser = user;
			console.log("200: Logged in user:", payload);
			response.send(payload);
		} else {
			console.log("Password incorrect");
			response.status(400).send({message: "Password incorrect"});
		}
	});
});

/*
 * URL /admin/logout - Logout user and destroy session.
 */
app.post('/admin/logout', function (request, response) {
	console.log("Handdle request: /admin/logout");
	const login_name = request.session.login_name;
	var message;
	if (sessionNotFound(request)) {
		message = "No session found for user.";
		console.log('Err 200:', message);
		response.status(200).send({message: message});
	} else {
		const user_id = request.session.loggedInUser._id;
		request.session.destroy(function (err) {
			if (err) {
				console.log("Error", err);
			}

			logActivity({ user_id: user_id, activity: "LOGOUT"});
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

		var payload = {_id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			location: user.location,
			description: user.description,
			occupation: user.occupation,
			mostRecent: null,
			mostCommented: null,
			mentions: null,
			favorites: user.favorites,
		};
		// find most commented photo & date
		// find most recentlu uploaded photo & date
		var cache = [];
		const properties = "file_name date_time commentCount";
		async.each(user.mentions, function(mention, callback) {
      Photo.findById(mention.photo_id, function (err, photo) {
        photo = JSON.parse(JSON.stringify(photo));
				photo.owner_name = mention.owner_name;
        cache.push(photo);
        callback();
      });
    }, function callback(err){
      if (err) {
          return response.status(400).send(JSON.stringify(err));
      }
      payload.mentions = cache;

			Photo.findOne({user_id: user._id}).select(properties).sort({date_time: -1}).exec(function(err, mostRecent) {
				payload.mostRecent = mostRecent;
				Photo.findOne({user_id: user._id}).select(properties).sort({commentCount: -1}).exec(function(err, mostCommentedOne) {
					if (mostCommentedOne === null) {
						console.log(payload);
						response.status(200).send(JSON.stringify(payload));
						return;
					}
					Photo.find({user_id: user._id, commentCount: mostCommentedOne.commentCount}).select(properties).exec(function(err, mostCommented) {
						payload.mostCommented = mostCommented;
						console.log(payload);
						response.status(200).send(JSON.stringify(payload));
					}); // close most commented photos
				}); // close most commented photo (singular)
			}); // close most recent photo
    }); // close mentions


	}); // close finding user
});

/*
 * URL /user/:user_id - delete account
 * Need to delete user account, all comments, photos, and activities
 * After user has been deleted, redirect to login page.
 */
app.delete("/user/:id", function (request, response) {
	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}

	const user_id = request.params.id;
	console.log("Delete user with ID", user_id);

	User.remove({_id: user_id}, function(err) {
		if (err) throw err;
		console.log('User was deleted');

		Activity.remove({user_id: user_id}, function(err) {
			if (err) throw err;
		});
		Photo.remove({user_id: user_id}, function(err) {
			if (err) throw err;
			console.log('Photos were deleted');

			// do not remove file from disk
			response.status(200).send({message: 'Photo has been deleted.'});
		});
	});
});

app.get('/photos/favorites/:user_id', function (request, response) {
	console.log("/photos/favorites/:user_id");
	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}
	const user_id = request.params.user_id;
	User.findOne({_id: user_id}, function(err, user){
		if (err) {
				response.status(400).send(JSON.stringify(err));
				return;
		}
		console.log(user);
		let favorites = user.favorites;
    let cache = [];
    async.each(favorites, function(favorite, callback) {
      Photo.findById(favorite.photo_id, function (err, photo) {
        photo = JSON.parse(JSON.stringify(photo));
        cache.push(photo);
        callback();
      });
    }, function callback(err){
        if (err) {
            return response.status(400).send(JSON.stringify(err));
        }
				console.log("!!!", cache);
        response.status(200).send(JSON.stringify(cache));
    });
	});
});

/*
 * URL /photo/:photoId - Get details of one photo.
 */
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
		photo.favorited = false; // default
		async.each(photo.comments, function(comment, didProcessCommentsForPhoto) {
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

			var u_query = User.findOne({_id: request.session.loggedInUser._id});
			u_query.select("_id favorites first_name");
			u_query.exec((err, user) => {
				user = JSON.parse(JSON.stringify(user));
				for (var i in user.favorites) {
					if (user.favorites[i].photo_id === photo._id) {
						photo.favorited = true;
					}
				}
				console.log("Processed request /photo/:photoId", user, photo);
				response.status(200).send(JSON.stringify(photo));
			});
		});
	});
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
	console.log('/photosOfUser/:id');
	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}

	var id = request.params.id;
	var u_query = User.findOne({_id: request.session.loggedInUser._id});
	u_query.select("_id favorites");
	u_query.exec(didFetchUser);

	function didFetchUser(err, user) {
		user = JSON.parse(JSON.stringify(user));
		var query = Photo.find({user_id: id});
		query.select("_id user_id file_name date_time likes comments commentCount");
		query.exec(function didFetchPhotos(err, photos) {
			if (err) {
				// Query returned an error.  We pass it back to the browser with an Internal Service
				// Error (500) error code.
				console.error('User_id invalid', err);
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
				photo.favorited = false;
				for (var i in user.favorites) {
					if (user.favorites[i].photo_id === photo._id) {
						photo.favorited = true;
					}
				}
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
					console.log(err);
					response.status(400).send("Error!");
					return;
				}
				console.log("OUTER MAIN CALLBACK", photosCopy);
				console.log(JSON.stringify(photosCopy));
				response.status(200).send(JSON.stringify(photosCopy));
			});
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
				logActivity({
          user_id: newPhoto.user_id,
					activity: "UPLOAD",
					photo_id: newPhoto._id,
					file_name: newPhoto.file_name
				});
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

/*
 * URL /photos/:photo_id - delete photos and comments
 */
app.delete("/photos/:photo_id", function (request, response) {

	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}

	const photo_id = request.params.photo_id;
	console.log("Delete photo with ID", photo_id);

	Photo.findOne({_id: photo_id}, function(err, photo) {
		if (err) {
			// Query returned an error.  We pass it back to the browser with an Internal Service
			// Error (500) error code.
			console.error('PhotoId invalid!', err);
			response.status(400).send({message: 'PhotoId invalid!'});
			return;
		}

		if (photo === null) {
			console.log('Photo with _id:' + photo_id + ' not found.');
			response.status(400).send({message: 'Not found'});
			return;
		}

		for (var comment of photo.comments) {
			clearMentionForComment(photo_id, comment);
		}

		Photo.remove({_id: photo_id}, function(err) {
			if (err) throw err;
			console.log('Photo was deleted');

			Activity.remove({photo_id: photo_id, activity: "UPLOAD"}, function(err) {
				if (err) throw err;
				console.log('Photo upload log activity was deleted');
			});

			Activity.remove({photo_id: photo_id, activity: "COMMENT"}, function(err) {
				if (err) throw err;
				console.log('Photo upload log activity was deleted');
			});

			// remove file from disk
			const file_name = "./images/" + photo.file_name;
			fs.unlink(file_name, (err) => {
        if (err) throw err;
        console.log(file_name, 'was deleted');
			});
			response.status(200).send({message: 'Photo has been deleted.'});
		});
	});
});

/*
 * URL /comments/:photo_id - add comment for photo
 */
app.post('/comments/:photo_id', function (request, response) {
	var id = request.params.photo_id;
	console.log("app.post('/comments/:photo_id')", id);
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

	var mentions = [];
	const user_ids = request.body.mentions;
	const owner_id = request.body.owner_id;

	if (user_ids !== undefined) {
		console.log("mentions", owner_id, user_ids);
		for (var user_id of user_ids) {
			mentions.push({user_id: user_id})
		}
		console.log(mentions);

		User.findOne({_id: owner_id}, (err, user) => {
			const owner_name = user.first_name + " " + user.last_name;
			async.each(user_ids, function(user_id, didMarkUserAsMentioned){
				User.findOne({_id: user_id}, (err, user) => {
					user.mentions = user.mentions.concat([{photo_id: id, owner_id: owner_id, owner_name: owner_name}]);
					user.save();
					didMarkUserAsMentioned();
				});
			}, function didMarkUserAsMentioned(err) {
				console.log("didMarkUserAsMentioned", err);
			});
		});
	}

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
			date_time: new Date(),
			mentions: mentions
		};
		photo.comments = photo.comments.concat([newComment]);
		console.log("photo", photo);
		photo.commentCount += 1;
		photo.save((err) => {
			console.log(err);
			logActivity({
				user_id: newComment.user_id,
				activity: "COMMENT",
				photo_id: photo._id,
				comment_id: photo.comments[photo.commentCount - 1]._id,
				file_name: photo.file_name
			});
		});

		photo = JSON.parse(JSON.stringify(photo));
		async.each(photo.comments, function(comment, didProcessCommentsForPhoto){
			var commentatorId = comment.user_id;
			var commentator = User.findOne({_id: commentatorId});
			console.log("Commentor ID", commentatorId);
			commentator.select("_id first_name last_name").exec(doneCallback);
			function doneCallback(err, commentator) {
				if (err) {
					response.status(400).send({message: 'User_id invalid!'});
					return;
				}
				if (commentator === null) {
					response.status(400).send({message: 'User not found:' + commentatorId});
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
			console.log("Processed request /photo/:photoId", photo);
			response.status(200).send(JSON.stringify(photo));
		});
	});
});

function clearMentionForComment(photo_id, comment) {
	var user_photo_id, user_id;
	for (var mention of comment.mentions) {
		user_id = mention.user_id;
		User.findOne({_id: user_id}, (err, user) => {
			console.log(user);
			var mentions = JSON.parse(JSON.stringify(user.mentions));
			for (var i in mentions) {
				user_photo_id = mentions[i].photo_id;
				if (user_photo_id === photo_id) {
					user.mentions.splice(i, 1);
					user.save();
					console.log("Removed mention from user.");
				}
			}
		});
	}
}
/*
 * URL /comments/:photo_id/:comment_id - delete comment of a photo
 */
app.delete("/comments/:photo_id/:comment_id", function (request, response) {

	var message;
	if (sessionNotFound(request)) {
		message = "Use is unauthorized.";
		console.log(message);
		response.status(401).send({message: message});
		return;
	}

	const photo_id = request.params.photo_id;
	const comment_id = request.params.comment_id;
	console.log("Delete comment with ID", photo_id, comment_id);
	Photo.findOne({_id: photo_id}, function(err, photo) {
		// omit error handling code
		var comments = JSON.parse(JSON.stringify(photo.comments));
		var comment;
		for (var j in comments) {
			comment = comments[j];
			console.log(comments);


			if (comment._id === comment_id) {
				console.log("Will delete comment: ", j, comment.comment);
				photo.comments.splice(j, 1);
				photo.commentCount -= 1;
			}
			clearMentionForComment(photo_id, comment)

		}

		Activity.remove({comment_id: comment_id},  function(err) {
			if (err) throw err;
		});

		// console.log(comments.splice(j, 1));
		photo.save(function(err) {
			console.log(err);
			response.status(200).send({message: 'Comment has been deleted.'});
		});
	});
});

var server = app.listen(3000, function () {
	var port = server.address().port;
	console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
