const chai = require('chai');
chai.should();

// SUT
const mut = require('../../code/user-side/user-controller').changeUserEmail;

// Unmanaged dependencies collaborator
const messageBus = require('../../code/server-side/unmanaged-dependencies/message-bus');

// Test helpers
const HttpClientSpy = require('./httpClientSpy');
const db = require('./../../../../../test/characterization/database-helper');
const userMother = require('../helper/object-mother/user');
const companyMother = require('../helper/object-mother/company');
const User = require('../helper/dsl-assertion/User');
const Company = require('../helper/dsl-assertion/Company');

// Constants
const userType = {Customer: 1, Employee: 2};
const COMPANY_DOMAIN_NAME = 'this-corp.com';

const message = {
    SUCCESSFUL_EXECUTION: 'OK',
    EMAIL_IS_ALREADY_TAKEN: 'email is taken',
    USER_DOES_NOT_EXISTS: 'user does not exists'
}

describe('integration | changeUserEmail', () => {

    beforeEach(async () => {
        await db.removeAll();
    });

    it('should allow email change email from corporate to non corporate', async () => {

        // Arrange
        const httpClientSpy = new HttpClientSpy();
        messageBus.setHttpClient(httpClientSpy);

        await companyMother.createCompany({});

        const userName = 'john.doe';
        const email = userName + '@' + COMPANY_DOMAIN_NAME;
        const userData = await userMother.createUser({email, type: userType.Employee});

        const newCompanyDomainName = 'that-corp.com';
        const newEmail = userName + '@' + newCompanyDomainName;
        const emailUpdate = {messageBus, id: userData.id, newEmail};

        // Act
        const response = await mut(emailUpdate);

        // Assert
        response.should.eq(message.SUCCESSFUL_EXECUTION);

        const actualUser = await (new User(userData.id)).fromDB();
        actualUser.shouldExists().withEmail(newEmail).withType(userType.Customer);

        const actualCompany = await (new Company()).fromDB();
        actualCompany.shouldExists().withEmployeeCount(0);

        httpClientSpy.shouldSendNumberOfMessages(1).withEmailChangedMessage({id: userData.id, newEmail});

    });


    it('should reject email change to an already use email', async () => {

        // Arrange
        const httpClientSpy = new HttpClientSpy();
        messageBus.setHttpClient(httpClientSpy);

        await companyMother.createCompany({});
        const firstUserData = await userMother.createUser({id: 0, email: 'employee1@that-corp.com'});
        const secondUserData = await userMother.createUser({id: 1, email: 'employee2@that-corp.com'});

        const emailUpdate = {messageBus, id: secondUserData.id, newEmail: firstUserData.email};

        // Act
        const response = await mut(emailUpdate);

        // Assert
        response.should.eq(message.EMAIL_IS_ALREADY_TAKEN);

    });

    it('should reject email change of a non-existing user ', async () => {

        // Arrange
        const httpClientSpy = new HttpClientSpy();
        messageBus.setHttpClient(httpClientSpy);

        await companyMother.createCompany({});
        const emailUpdate = {messageBus, id: 0 , newEmail: 'employee1@that-corp.com'};

        // Act
        const response = await mut(emailUpdate);

        // Assert
        response.should.eq(message.USER_DOES_NOT_EXISTS);

    });
});