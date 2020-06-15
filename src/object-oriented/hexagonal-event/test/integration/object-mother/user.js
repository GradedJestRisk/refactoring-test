const db = require('./../../../../../../test/characterization/database-helper');
const userType = {Customer: 1, Employee: 2};

const createUser = async function ({id = 0, email = 'john.doe@this-corp.com', type = userType.Employee, isEmailConfirmed = false}) {
    const user = {id, email, type, isEmailConfirmed};
    await db.addUser(user);
    return user;
};

module.exports = {createUser};