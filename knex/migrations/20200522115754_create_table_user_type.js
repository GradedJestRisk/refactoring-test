const tableName = 'user_type';
exports.up = function(knex) {
    return knex.schema.createTable(tableName, (table)=>{
       table.integer('type').notNullable().primary();
       table.string('label', 10).notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};