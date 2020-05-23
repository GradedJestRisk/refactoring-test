const TABLE_NAME = 'company'
exports.up = function(knex) {

    return knex.schema.createTable(TABLE_NAME, (table) => {
        table.string('domainName', 50).notNullable()
        table.integer('numberOfEmployees').notNullable()
    })

};

exports.down = function(knex) {
    return knex.schema.dropTable(TABLE_NAME);
};
