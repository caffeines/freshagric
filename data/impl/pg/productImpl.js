const { v4: uuid } = require('uuid');
const shortId = require('shortid');
const slug = require('slug');
const knex = require('../../../lib/knexhelper').getKnexInstance();

module.exports = {
  /**
   * Create a new product.
   * @async
   * @param {Object} Product - a product object.
   * @returns {Promise} - a Promise, resolving to the product value
   *   with the ID of the product in the database.
  */
  create: async (data) => {
    try {
      const product = {
        createdAt: new Date(),
        SKU: shortId.generate(),
        slug: slug(data.name),
        id: uuid(),
        ...data,
      };
      await knex('Products').insert(product);
      return product;
    } catch (err) {
      return Promise.reject(err);
    }
  },
};
