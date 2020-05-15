const knex = require('../../../../../knex/knex');

const getUserById = async function (id) {
    return knex('user').where({id}).first();
}

const getUserByEmail = function (email) {
    return knex('user').where({email});
}

const saveUser = function (user) {
    return knex('user').where({id: user.id}).update(user)
}

const getCompany = function () {
    return knex('company').first();
}

const saveCompany = function (newNumber) {
    return knex('company').update({numberOfEmployees: newNumber})
}

module.exports = {getUserById, getUserByEmail, saveUser, getCompany, saveCompany}