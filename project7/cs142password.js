var crypto = require('crypto');

/*
 * Return a salted and hashed password entry from a
 * clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry
 * where passwordEntry is an object with two string
 * properties:
 *      salt - The salt used for the password.
 *      hash - The sha1 hash of the password and salt
 */
function makePasswordEntry(clearTextPassword) {
	var saltNum = crypto.randomBytes(8).toString('hex');
  var has = crypto.createHash('sha1');
  has.update(clearTextPassword + saltNum);
  return {salt:saltNum, hash:has.digest('hex')};
}

/*
 * Return true if the specified clear text password
 * and salt generates the specified hash.
 * @param {string} hash
 * @param {string} salt
 * @param {string} clearTextPassword
 * @return {boolean}
 */
function doesPasswordMatch(hash, salt, clearTextPassword) {
  var has = crypto.createHash('sha1');
  has.update(clearTextPassword + salt);
	return hash === has.digest("hex");
}

module.exports = {
  makePasswordEntry,
  doesPasswordMatch
}
