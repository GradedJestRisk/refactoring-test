const knex = require('../knex/knex');

const removeUser = async function (id) {
    await knex('user').where('id',id).delete();
};

const removeAllUsers = async function () {
    await knex('user').del();
};

const addUser = async function (user) {
    await knex('user').insert([user]);
};



const addUsers = async function (users) {
    await Promise.all(
        users.map(async (user) => {
            await addUser(user);
        })
    );
};

const getUser = async function (id) {
    return knex('user').where('id', id).first();
};

const removeCompany = async function () {
    await knex('company').del();
};

const addCompany = async function (numberOfEmployees = 0) {
    const company = {domainName: 'this-corp.com', numberOfEmployees};
    await knex('company').insert([company]);
};

const getCompanyEmployeeCount = async function () {
    const data = await knex('company').select('numberOfEmployees').first();
    return data.numberOfEmployees;
};

const removeAll = async function () {
    await removeCompany();
    await removeAllUsers();
};

module.exports = {
    removeUser,
    removeAllUsers,
    addUser,
    addUsers,
    getUser,
    removeCompany,
    addCompany,
    getCompanyEmployeeCount,
    removeAll
}