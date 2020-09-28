const impl = require('./impl/pg/userImpl');

module.exports = {
  /**
   * Create a new user.
   * @async
   * @param {Object} user - a user object.
   * @returns {Promise} - a Promise, resolving to the user value in the database.
   */
  createUser: async (user) => impl.createUser(user),
  /**
   * Find user by email.
   * @async
   * @param {String} email - a user's email.
   * @param {Boolean} safe - safe query flag.
   * @returns {Promise} - a Promise, resolved value user.
   */
  findUserByEmail: async (email, safe) => impl.findUserByEmail(email, safe),

  updateVerificationCode: async (email) => impl.updateVerificationCode(email),

  verifyUser: async (email, code) => impl.verifyUser(email, code),
};
