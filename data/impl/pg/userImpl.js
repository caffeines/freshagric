const shortUUID = require('short-uuid');
const knex = require('../../../lib/knexhelper').getKnexInstance();
const constant = require('../../../constants');

const safeFields = ['email', 'name', 'userType', 'userStatus', 'joinedAt', 'contact'];

module.exports = {
  /**
   * Create a new site.
   * @async
   * @param {Object} user - a user object.
   * @returns {Promise} - a Promise, resolving to the user value
   *   with the ID of the user in the database.
   */
  createUser: async (data) => {
    try {
      const now = new Date();
      const user = {
        ...data,
        isVerified: false,
        userStatus: constant.userStatus.REGISTERED,
        userType: constant.userType.PUBLIC,
        verificationCode: shortUUID.generate(),
        verificationCodeGeneratedAt: now,
        joinedAt: now,
        updatedAt: now,
      };
      await knex('Users').insert(user);
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  },
  findUserByEmail: async (email, safe = false) => {
    try {
      let selectFileds = safeFields;
      if (safe) selectFileds = '*';
      const [user] = await knex('Users').select(selectFileds).where({ email });
      return user;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  updateVerificationCode: async (email) => {
    try {
      const updateData = {
        verificationCode: shortUUID.generate(),
        verificationCodeGeneratedAt: new Date(),
      };
      await knex('Users').update(updateData).where({ email });
      return updateData;
    } catch (err) {
      return Promise.reject(err);
    }
  },
};
