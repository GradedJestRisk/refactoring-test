const TABLE_NAME = 'company';
exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex(TABLE_NAME).del()
        .then(function () {
            // Inserts seed entries
            return knex(TABLE_NAME).insert([
                {domainName: 'this-corp.com', numberOfEmployees: 2}
            ]);
        });
};

