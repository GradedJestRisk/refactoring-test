const userRepository = require('../infrastructure/managed-dependencies/user-repository')
const companyRepository = require('../infrastructure/managed-dependencies/company-repository')
const User = require('../domain/User');
const Company = require('../domain/Company');

const SUCCESSFUL_EXECUTION_MESSAGE = 'OK'

const changeUserEmail = async function ({ messageBus, id, newEmail}) {

    // Call repository with canExecute pattern - is this OK ?
    const emailAlreadyTakenMessage = await userRepository.isEmailAlreadyTaken(newEmail);
    if (emailAlreadyTakenMessage != null) {
        return emailAlreadyTakenMessage;
    }

    // Get data
    const userData = await userRepository.getUserById(id);
    const user = new User(userData);

    // Call domain with canExecute pattern
    const errorMessage = user.canChangeEmail();

    if (errorMessage != null) {
        return errorMessage;
    }

    // Get data
    const companyData = await companyRepository.getCompany();
    const company = new Company(companyData);

    // Call domain
    await user.changeEmail(newEmail, company);

    // Propagate side effects
    await companyRepository.updateEmployeeCount(company.numberOfEmployees);
    await userRepository.saveUser({ id: user.id, email: user.email, type : user.type, isEmailConfirmed: user.isEmailConfirmed});
    await Promise.all(
        user.emailChangedEvents.map(async (emailChangedEvent) => {
            await messageBus.propagateEmailChange({
                userId: emailChangedEvent.userId,
                newEmail: emailChangedEvent.newEmail
            });
        })
    );

    return SUCCESSFUL_EXECUTION_MESSAGE;
}

module.exports = changeUserEmail;