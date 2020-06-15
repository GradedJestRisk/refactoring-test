const chai = require('chai');
chai.should();

// SUT
const mut = require('../../code/application/user-controller');

// Unmanaged dependencies collaborator
const messageBus = require('../../code/infrastructure/unmanaged-dependencies/message-bus');

// Test helpers
const HttpClientSpy = require('./httpClientSpy');
const db = require('./../../../../../test/characterization/database-helper');
const userMother = require('./object-mother/user');
const companyMother = require('./object-mother/company');
const User = require('./dsl-assertion/User');
const Company = require('./dsl-assertion/Company');

// Constants
const userType = {Customer: 1, Employee: 2};
const COMPANY_DOMAIN_NAME = 'this-corp.com';
const SUCCESSFUL_EXECUTION_MESSAGE = 'OK'
const EMAIL_IS_ALREADY_TAKEN_MESSAGE = 'email is taken';
const USER_DOES_NOT_EXISTS_MESSAGE = 'user does not exists';


describe('integration | changeUserEmail', () => {

    beforeEach(async () => {
        await db.removeAll();
    });

    it('changing email from corporate to non corporate', async () => {

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
        response.should.eq(SUCCESSFUL_EXECUTION_MESSAGE);

        const actualUser = await (new User(userData.id)).fromDB();
        actualUser.shouldExists().withEmail(newEmail).withType(userType.Customer);

        const actualCompany = await (new Company()).fromDB();
        actualCompany.shouldExists().withEmployeeCount(0);

        httpClientSpy.shouldSendNumberOfMessages(1).withEmailChangedMessage({id: userData.id, newEmail});

    });


    it('changing email to already taken', async () => {

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
        //response.should.eq(EMAIL_IS_ALREADY_TAKEN_MESSAGE);
        response.should.eq(EMAIL_IS_ALREADY_TAKEN_MESSAGE);

    });

    it('changing email of non-existing user ', async () => {

        // Arrange
        const httpClientSpy = new HttpClientSpy();
        messageBus.setHttpClient(httpClientSpy);

        await companyMother.createCompany({});
        const emailUpdate = {messageBus, id: 0 , newEmail: 'employee1@that-corp.com'};

        // Act
        const response = await mut(emailUpdate);

        // Assert
        response.should.eq(USER_DOES_NOT_EXISTS_MESSAGE);

    });
});