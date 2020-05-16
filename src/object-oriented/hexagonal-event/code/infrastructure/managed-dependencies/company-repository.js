const knex = require('../../../../../../knex/knex');

const getCompany = function () {
    return knex('company').first();
}

const updateEmployeeCount = function (number) {
    return knex('company').update({numberOfEmployees: number});
}

module.exports = { getCompany, updateEmployeeCount };