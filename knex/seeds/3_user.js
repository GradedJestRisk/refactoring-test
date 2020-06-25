const TABLE_NAME = 'user';
exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex(TABLE_NAME).del()
        .then(function () {
            // Inserts seed entries
            return knex(TABLE_NAME).insert([
                {id: 0, email: 'employee_one@this-corp.com', type: 2,  isEmailConfirmed: false},
                {id: 1, email: 'customer_one@another-corp.com', type: 1,  isEmailConfirmed: false},
                {id: 2, email: 'employee-two@this-corp.com', type: 2,  isEmailConfirmed: true},
            ]);
        });
};
