const httpClient = require('axios');
const chai = require('chai');
chai.should();

// Test helpers
const db = require('../../../../../test/database-helper');
const userMother = require('../helper/object-mother/user');

const RESPONSE_STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404
}

const baseUrl = 'http://localhost:3000/users/';

describe('End-to-end | user', async () => {

    describe('getUser', async () => {

        beforeEach(async () => {
            await db.removeAll();
        });


        it('should return 200 when user does exists', async () => {

            // Arrange
            const dbUser = await userMother.createUser({id : 1});
            const requestUrl = baseUrl + dbUser.id;

            // Act
            const response = await httpClient.get(requestUrl);

            // Assert
            response.status.should.eq(RESPONSE_STATUS_CODE.OK);
            response.data.user.should.deep.eq(dbUser);

        });

        it('should return 404 when user does not exists', async () => {

            // Arrange
            const requestUrl = baseUrl + '-1';
            let response;

            // Act
            try {
                response = await httpClient.get(requestUrl);
            } catch (error) {
                response = error.response;
            }

            // Assert
            response.status.should.eq(RESPONSE_STATUS_CODE.NOT_FOUND);

        });

    })

    describe('change email', async () => {

        const baseUrl = 'http://localhost:3000/users/';
        const requestSegment = '/email';

        beforeEach(async () => {
            await db.removeAll();
            await db.removeCompany();
            await db.addCompany(1);
        });

        it('should return 201 and update email when update succeeds', async () => {

            // Arrange
            const dbUser = await userMother.createUser({});
            const requestUrl = baseUrl + dbUser.id + requestSegment;
            const expectedEmail= 'foo@this-corp.com';

            // Act
            const message =
                {
                    id: dbUser.id,
                    email: expectedEmail
                };

            const response = await httpClient({url: requestUrl, method: 'post', data: message});

            // Assert
            response.status.should.eq(RESPONSE_STATUS_CODE.CREATED);
            const actualUser = await db.getUser(dbUser.id);
            actualUser.email.should.eq(expectedEmail)

        });


        it('should return 400 when incorrect property', async () => {

            // Arrange
            const dbUser = await userMother.createUser({});
            const requestUrl = baseUrl + dbUser.id + requestSegment;

            // Act
            const message =
                {
                    id: dbUser.id,
                    email: 'foo'
                };

            let response;

            // Act
            try {
                await httpClient({url: requestUrl, method: 'post', data: message});
            } catch (error) {
                response = error.response;
            }

            // Assert
            response.status.should.eq(RESPONSE_STATUS_CODE.BAD_REQUEST);

        });

        it('should return 400 when missing property', async () => {

            // Arrange
            const dbUser = await userMother.createUser({});
            const requestUrl = baseUrl + dbUser.id + requestSegment;

            // Act
            const message =
                {
                    id: dbUser.id
                };

            let response;

            // Act
            try {
                await httpClient({url: requestUrl, method: 'post', data: message});
            } catch (error) {
                response = error.response;
            }

            // Assert
            response.status.should.eq(RESPONSE_STATUS_CODE.BAD_REQUEST);

        });

    });

});