const db = require('../../../../../../test/characterization/database-helper');

const createCompany = async function ({employeeCount = 1}) {
    await db.addCompany(employeeCount);
};

module.exports = {createCompany};