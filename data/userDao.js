const impl = require('./impl/pg/userImpl');

module.exports = {
  /**
   * Create a new user.
   * @async
   * @param {Object} user - a user object.
   * @returns {Promise} - a Promise, resolving to the user value
   *   with the ID of the user in the database.
   */
  createUser: async (user) => impl.createUser(user),
};
