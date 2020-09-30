const { v4: uuid } = require('uuid');
const shortId = require('shortid');
const slug = require('slug');
const knex = require('../../../lib/knexhelper').getKnexInstance();

const safeFields = ['cost', 'createdBy', 'updatedBy', 'updatedAt'];
const selectFields = ['createdAt', 'SKU', 'slug', 'id', 'name', 'description',
  'category', 'price', 'unit', 'stock', 'isOrganic', 'image'];

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

  getAll: async (safe = false) => {
    try {
      if (safe) selectFields.push(...safeFields);
      const products = await knex('Products')
        .select(selectFields)
        .where({ isPublished: true });
      return products;
    } catch (err) {
      return Promise.reject(err);
    }
  },
};
