"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var mongoose = require('mongoose');

var favoritesSchema = new mongoose.Schema({
    photo_id: mongoose.Schema.Types.ObjectId
});

var mentionsSchema = new mongoose.Schema({
    photo_id: mongoose.Schema.Types.ObjectId,
    owner_name: String,
    owner_id: mongoose.Schema.Types.ObjectId
});

// create a schema
var userSchema = new mongoose.Schema({
    login_name: String,
    // password: String,
    password_digest: String,
    salt: String,
    first_name: String, // First name of the user.
    last_name: String,  // Last name of the user.
    location: String,    // Location  of the user.
    description: String,  // A brief user description.
    occupation: String,    // Occupation of the user.
    favorites: [favoritesSchema], // photos favorited by user.
    mentions: [mentionsSchema],
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
