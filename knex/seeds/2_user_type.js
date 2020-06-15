const dependantTableName = 'user';
const tableName = 'user_type';

exports.seed = function (knex) {

    return knex(dependantTableName).del()
        .then(function () {
            return knex(tableName).del()
        })
        .then(function () {
            return knex(tableName).insert([
                {type: 1, label: 'customer'},
                {type: 2, label: 'employee'}
            ]);
        });
};
