const chai = require('chai');
chai.should();

const mut = require('../../code/application/user-controller');
const messageBus = require('../../code/infrastructure/unmanaged-dependencies/message-bus');

// Test helpers
const HttpClientSpy = require('./httpClientSpy');
const db = require('./../../../../../test/characterization/database-helper');
const knex = require('../../../../../knex/knex');
const User = require('./UserAssertion');

// Test values
const userType = {Customer: 1, Employee: 2};
const COMPANY_DOMAIN_NAME = 'this-corp.com';
const SUCCESSFUL_EXECUTION_MESSAGE = 'OK'

describe('integration | changeUserEmail', () => {

    beforeEach(async () => {
        await db.removeAll();
    });

    const createUser = async function ({id = 0, email = 'john.doe@this-corp.com', type = userType.Employee, isEmailConfirmed = false}) {
        const user = {id, email, type, isEmailConfirmed};
        await db.addUser(user);
        return user;
    };

    const createCompany = async function ({employeeCount = 1}) {
        await db.addCompany(employeeCount);
    };

    const getUserForAssert = async function (id) {
        return new User(await knex('user').where('id', id).first());
    };



    it('changing email from corporate to non corporate', async () => {

        // Arrange
        const httpClientSpy = new HttpClientSpy();
        messageBus.setHttpClient(httpClientSpy);

        await createCompany({});

        const userName = 'john.doe';
        const email = userName + '@' + COMPANY_DOMAIN_NAME;
        const user = await createUser({email, type: userType.Employee});

        const newCompanyDomainName = 'that-corp.com';
        const newEmail = userName + '@' + newCompanyDomainName;
        const emailUpdate = {messageBus, id: user.id, newEmail};

        // Act
        const response = await mut(emailUpdate);

        // Assert
        response.should.eq(SUCCESSFUL_EXECUTION_MESSAGE);

        const userForAssert = await getUserForAssert(user.id);
        userForAssert.shouldExists().withEmail(newEmail).withType(userType.Customer);

        const actualEmployeeCount = await db.getCompanyEmployeeCount();
        actualEmployeeCount.should.eq(0);

        httpClientSpy.shouldSendNumberOfMessages(1).withEmailChangedMessage({id: user.id, newEmail});

    });
});