const tableName = 'user';

exports.up = function(knex) {
    return knex.schema.alterTable(tableName, (table)=>{
        table.integer('type').notNullable().references('type').inTable('user_type').alter();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable(tableName, (table)=>{
        table.integer('type').alter();
    });
};
