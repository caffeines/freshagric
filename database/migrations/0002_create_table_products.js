exports.up = function (knex) {
  return knex.schema.createTable('Products', (t) => {
    t.string('id');
    t.string('name');
    t.string('slug');
    t.string('Description', 2000);
    t.boolean('isPublished').defaultTo(true);
    t.boolean('isOrganic').defaultTo(false);
    t.string('category');
    t.string('subCategory');
    t.string('SKU');
    t.integer('stock');
    t.integer('price');
    t.integer('cost');
    t.string('image');
    t.string('unit');
    t.integer('maxQuantityCount');
    t.string('createdBy')
      .references('email')
      .inTable('Users')
      .onDelete('RESTRICT');
    t.string('updatedBy')
      .references('email')
      .inTable('Users')
      .onDelete('RESTRICT');
    t.timestamp('createddAt');
    t.timestamp('updatedAt');
    t.primary(['id']);
    t.index(['name']);
    t.unique(['name']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Products');
};
