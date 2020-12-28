exports.up = function (knex) {
  return knex.schema.createTable('OrderItems', (t) => {
    t.string('orderId')
      .references('id')
      .inTable('Orders')
      .onDelete('RESTRICT');
    t.string('productId')
      .references('id')
      .inTable('Products')
      .onDelete('RESTRICT');
    t.integer('quantity');
    t.primary(['orderId', 'productId']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('OrderItems');
};
