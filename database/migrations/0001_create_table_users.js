exports.up = function (knex) {
  return knex.schema.createTable('Users', (t) => {
    t.string('contact', 20);
    t.string('email', 150);
    t.string('password');
    t.string('name');
    t.boolean('isVerified');
    t.string('userStatus');
    t.string('userType');
    t.string('profilePicture');
    t.string('resetPasswordToken');
    t.string('resetPasswordTokenGeneratedAt');
    t.string('verificationCode');
    t.integer('verificationRetries');
    t.dateTime('verificationCodeGeneratedAt');
    t.string('address', 500);
    t.string('longitude');
    t.string('latitude');
    t.timestamp('joinedAt');
    t.timestamp('updatedAt');
    t.primary(['email']);
    t.index(['contact']);
    t.unique(['contact']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Users');
};
