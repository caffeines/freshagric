const productImpl = require('./impl/pg/productImpl');

module.exports = {
  /**
   * Create a new product.
   * @async
   * @param {Object} Product - a product object.
   * @returns {Promise} - a Promise, resolving to the product value
   *   with the ID of the product in the database.
  */
  createProduct: async (data) => productImpl.create(data),
};
