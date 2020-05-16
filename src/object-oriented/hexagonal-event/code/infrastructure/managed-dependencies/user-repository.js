const knex = require('../../../../../../knex/knex');

const getUserById = async function (id) {
    return knex('user').where({id}).first();
}

const isEmailAlreadyTaken = async function (email) {
    const emailCount = (await knex('user').where({email}).count().first()).count;
    if (emailCount > 0){
        return "Email is taken";
    } else {
        return null;
    }
}

const saveUser = function (user) {
    return knex('user').where({id: user.id}).update(user)
}

module.exports = {getUserById, isEmailAlreadyTaken, saveUser}