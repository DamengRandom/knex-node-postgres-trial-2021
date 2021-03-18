
exports.up = function(knex) {
  return knex.schema.createTable('person', table => {
    table.increments('id');
    table.string('email').notNullable().unique();
    table.string('first_name').notNullable(); // please use underscore instead of using camel case, avoid DB issues !!!
    table.string('last_name').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('person');
};
