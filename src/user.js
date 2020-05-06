const database = require('./database');
const messageBus = require('./message-bus');
const userType = {Customer: 1, Employee: 2};

const changeEmail = async function ({id, newEmail}) {

    const data = await database.getUserById(id);
    const user = {};

    user.id = id;
    user.email = data.email;
    user.type = data.type;

    if (user.email === newEmail) {
        return;
    }

    const userWithEmail = await database.getUserByEmail({email: newEmail});
    const isEmailTaken = (userWithEmail.length !== 0);
    if (isEmailTaken) {
        return "Email is taken";
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
    messageBus.sendEmailChange({id, newEmail});

}

module.exports = {changeEmail};