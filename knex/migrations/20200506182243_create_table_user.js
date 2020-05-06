const TABLE_NAME = 'user';

exports.up = function(knex) {
    return knex.schema.createTable(TABLE_NAME, (table) => {
        table.integer('id').notNullable().primary('PK_user')
        table.string('email', 50).notNullable()
        table.integer('type')
        table.boolean('isEmailConfirmed').notNullable()
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable(TABLE_NAME)
};
