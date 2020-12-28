exports.up = function (knex) {
  return knex.schema.table('Orders', (t) => {
    t.string('deliveryArea');
    t.index('deliveryArea');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Orders', (t) => {
    t.dropColumn('deliveryArea');
    t.dropIndex('deliveryArea');
  });
};
