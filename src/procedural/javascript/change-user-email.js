const database = require('./out-of-process-dependencies/managed/database');
const messageBus = require('./out-of-process-dependencies/unmanaged/propagate-change');
const userType = {Customer: 1, Employee: 2};

const changeUserEmail = async function ({id, newEmail}) {

    const data = await database.getUserById(id);
    const user = {};

    user.id = id;
    user.email = data.email;
    user.type = data.type;

    if (user.email === newEmail) {
        return;
    }

    const userWithEmail = await database.getUserByEmail(newEmail);
    const isEmailTaken = (userWithEmail.length !== 0);
    if (isEmailTaken) {
        return "email is taken";
    }

    const companyData = await database.getCompany();
    const companyDomainName = companyData.domainName;
    const numberOfEmployees = companyData.numberOfEmployees;

    const emailDomain = newEmail.split('@')[1];
    const isEmailCorporate = (emailDomain === companyDomainName);
    const newType = (isEmailCorporate
            ? userType.Employee : userType.Customer
    );

    if (user.type !== newType) {
        const delta = (newType === userType.Employee ? 1 : -1)
        const newNumber = numberOfEmployees + delta;
        await database.saveCompany(newNumber);
    }

    user.email = newEmail;
    user.type = newType;

    await database.saveUser(user);
    await messageBus.propagateEmailChange({id, newEmail});

}

module.exports = changeUserEmail;