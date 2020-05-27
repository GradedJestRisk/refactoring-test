const chai = require('chai');
chai.should();

const mut = require('../../code/application/user-controller');
const messageBus = require('../../code/infrastructure/unmanaged-dependencies/message-bus');

// Test helpers
const HttpClientSpy = require('./httpClientSpy');
const db = require('./../../../../../test/characterization/database-helper');

// Test values
const userType = {Customer: 1, Employee: 2};
const COMPANY_DOMAIN_NAME = 'this-corp.com';
const SUCCESSFUL_EXECUTION_MESSAGE = 'OK'

describe('integration | changeUserEmail', () => {

    beforeEach(async () => {
        await db.removeAll();
    });

    it('changing email from corporate to non corporate', async () => {

        // Arrange

        const httpClientSpy = new HttpClientSpy();
        messageBus.setHttpClient(httpClientSpy);

        const employeeCount = 1;
        await db.addCompany(employeeCount);

        const userName = 'john.doe';
        const email = userName + '@' + COMPANY_DOMAIN_NAME;
        const user = {
            id: 0,
            email,
            type: userType.Employee,
            isEmailConfirmed: false
        };
        await db.addUser(user);

        const newCompanyDomainName = 'that-corp.com';
        const newEmail = userName + '@' + newCompanyDomainName;
        const emailUpdate = {messageBus, id: user.id, newEmail};

        // Act
        const response = await mut(emailUpdate);

        // Assert
        response.should.eq(SUCCESSFUL_EXECUTION_MESSAGE);

        const actualUser = await db.getUser(user.id);
        actualUser.email.should.eq(newEmail);
        actualUser.type.should.eq(userType.Customer);

        const actualEmployeeCount = await db.getCompanyEmployeeCount();
        actualEmployeeCount.should.eq(0);

        httpClientSpy.shouldSendNumberOfMessages(1).withEmailChangedMessage( { id: user.id, newEmail});

    });
});