"use strict";

/* jshint node: true */
/* global Promise */

/*
 * This Node.js program loads the CS142 Project #7 model data into Mongoose defined objects
 * in a MongoDB database. It can be run with the command:
 *     node loadDatabase.js
 * be sure to have an instance of the MongoDB running on the localhost.
 *
 * This script loads the data into the MongoDB database named 'cs142project6'.  In loads
 * into collections named User and Photos. The Comments are added in the Photos of the
 * comments. Any previous objects in those collections is discarded.
 *
 * NOTE: This scripts uses Promise abstraction for handling the async calls to
 * the database. We are not teaching Promises in CS142 so strongly suggest you don't
 * use them in your solution.
 *
 */

// Get the magic models we used in the previous projects.
var cs142models = require('./modelData/photoApp.js').cs142models;
var salt = require('./cs142password.js');

// We use the Mongoose to define the schema stored in MongoDB.
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/cs142project6', { useMongoClient: true });

// Load the Mongoose schema for Use and Photo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var Activity = require('./schema/activity.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var versionString = '1.0';

// We start by removing anything that existing in the collections.
var removePromises = [User.remove({}), Photo.remove({}), Activity.remove({}), SchemaInfo.remove({})];

Promise.all(removePromises).then(function () {

    // Load the users into the User. Mongo assigns ids to objects so we record
    // the assigned '_id' back into the cs142model.userListModels so we have it
    // later in the script.

    var userModels = cs142models.userListModel();
    var mapFakeId2RealId = {}; // Map from fake id to real Mongo _id
    var userPromises = userModels.map(function (user) {
        var digest = salt.makePasswordEntry("weak");
        return User.create({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            location: user.location,
            description: user.description,
            occupation: user.occupation,
            login_name: user.last_name.toLowerCase(),
            password_digest: digest.hash,
            salt: digest.salt,
            favorites: user.favorites,
            // mentions: user.mentions,
        }).then(function (userObj) {
            // Set the unique ID of the object. We use the MongoDB generated _id for now
            // but we keep it distinct from the MongoDB ID so we can go to something
            // prettier in the future since these show up in URLs, etc.
            userObj.save();
            mapFakeId2RealId[user._id] = userObj._id;
            user.objectID = userObj._id;
            console.log('Adding user:', user.first_name + ' ' + user.last_name, ' with ID ',
                user.objectID);
        }).catch(function (err){
            console.error('Error create user', err);
        });
    });

    // create a single act
    // const data = {
    //   user_id: "57231f1a30e4351f4e9f4bdd",
    //   activity: "UPLOAD",
    //   photo_id: "57231f1a30e4351f4e9f4be9",
    //   date_time: "2019-05-16 17:12:28"
    // }
    // Activity.create(data, function(err, newActivity) {
		// 	console.log(err, newActivity);
		// 	newActivity.save();
		// });

    // use data defined in modelData
    var activityListModel = cs142models.activityListModel();
    var activityPromises = activityListModel.map(function (activity) {
        return Activity.create({
            user_id: activity.user_id,
            activity: activity.activity,
            photo_id: activity.photo_id,
            comment_id: activity.comment_id,
            file_name: activity.file_name,
            date_time: activity.date_time
        }).then(function (activityObj) {
            // Set the unique ID of the object. We use the MongoDB generated _id for now
            // but we keep it distinct from the MongoDB ID so we can go to something
            // prettier in the future since these show up in URLs, etc.
            activityObj.save();
            console.log('Adding activity:', activityObj.activity + ' ' + activityObj.user_id);
        }).catch(function (err){
            console.error('Error create user', err, activity);
        });
    });
    console.log(activityPromises);

    var allPromises = Promise.all(userPromises).then(function () {
        // Once we've loaded all the users into the User collection we add all the photos. Note
        // that the user_id of the photo is the MongoDB assigned id in the User object.
        var photoModels = [];
        var userIDs = Object.keys(mapFakeId2RealId);
        for (var i = 0; i < userIDs.length; i++) {
            photoModels = photoModels.concat(cs142models.photoOfUserModel(userIDs[i]));
        }
        var photoPromises = photoModels.map(function (photo) {
            return Photo.create({
                file_name: photo.file_name,
                date_time: photo.date_time,
                user_id: mapFakeId2RealId[photo.user_id],
                _id: photo._id,
            }).then(function (photoObj) {
                if (photo.comments) {
                    photo.comments.forEach(function (comment) {
                        photoObj.comments = photoObj.comments.concat([{
                            comment: comment.comment,
                            date_time: comment.date_time,
                            user_id: comment.user.objectID,
                            // mentions: comment.mentions,
                        }]);
                        console.log("Adding comment of length %d by user %s to photo %s",
                            comment.comment.length,
                            comment.user.objectID,
                            photo.file_name);
                    });
                }
                photoObj.commentCount = photoObj.comments.length;
                photoObj.save();
                console.log('Adding photo:', photo.file_name, ' of user ID ', photoObj.user_id);
            }).catch(function (err){
                console.error('Error create user', err);
            });
        });
        return Promise.all(photoPromises).then(function () {
            // Create the SchemaInfo object
            return SchemaInfo.create({
                version: versionString
            }).then(function (schemaInfo) {
                console.log('SchemaInfo object ', schemaInfo, ' created with version ', versionString);
            }).catch(function (err){
                console.error('Error create schemaInfo', err);
            });
        });
    });

    allPromises.then(function () {
        mongoose.disconnect();
    });

}).catch(function(err){
    console.error('Error create schemaInfo', err);
});
