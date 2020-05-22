
exports.up = function(knex) {
    return knex.raw('ALTER TABLE \"company\" ADD CONSTRAINT employee_count_not_negative CHECK (\"numberOfEmployees\" >= 0)');
};

exports.down = function(knex) {
    return knex.raw('ALTER TABLE \"company\" DROP CONSTRAINT employee_count_not_negative');
};
