const userRepository = require('../infrastructure/managed-dependencies/user-repository')
const companyRepository = require('../infrastructure/managed-dependencies/company-repository')
const User = require('../domain/User');
const Company = require('../domain/Company');
const knex = require('../../../../../knex/knex');
const assert = require('assert').strict;

const SUCCESSFUL_EXECUTION_MESSAGE = 'OK';
const USER_DOES_NOT_EXISTS_MESSAGE = 'user does not exists';
const EMAIL_IS_ALREADY_TAKEN_MESSAGE = 'email is taken';

const changeUserEmail = async function ({messageBus, id, newEmail}) {

    try {
        return await knex.transaction(async function (transaction) {

            if (!await userRepository.userExists(transaction, id)) {
                return USER_DOES_NOT_EXISTS_MESSAGE;
            }

            if (await userRepository.isEmailAlreadyTaken({transaction, email: newEmail, id})){
                return EMAIL_IS_ALREADY_TAKEN_MESSAGE;
            }

            // Get data
            const userData = await userRepository.getUserById(transaction, id);
            const user = new User(userData);

            // Call domain with canExecute pattern
            const errorMessage = user.canChangeEmail();

            if (errorMessage != null) {
                console.log('errorMessage' + errorMessage);
                return errorMessage;
            }

            // Get data
            const companyData = await companyRepository.getCompany(transaction);
            const company = new Company(companyData);

            // Call domain
            await user.changeEmail(newEmail, company);

            // Propagate side effects
            await companyRepository.updateEmployeeCount(transaction, company.numberOfEmployees);
            await userRepository.saveUser(transaction, {
                id: user.id,
                email: user.email,
                type: user.type,
                isEmailConfirmed: user.isEmailConfirmed
            });
            await Promise.all(
                user.emailChangedEvents.map(async (emailChangedEvent) => {
                    await messageBus.propagateEmailChange({
                        id: emailChangedEvent.userId,
                        newEmail: emailChangedEvent.newEmail
                    });
                })
            );

            return SUCCESSFUL_EXECUTION_MESSAGE;

        })
    } catch (error) {
        console.error("Error raised during transaction:" + error);
    }
}

module.exports = changeUserEmail;