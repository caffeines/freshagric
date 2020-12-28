exports.up = function (knex) {
  return knex.schema.createTable('Orders', (t) => {
    t.string('id');
    t.string('userId')
      .references('email')
      .inTable('Users')
      .onDelete('RESTRICT');
    t.timestamp('createdAt');
    t.timestamp('updatedAt');
    t.string('status');
    t.string('deliveryAddress');
    t.float('totalPrice');
    t.primary(['id']);
    t.index(['userId']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Orders');
};
