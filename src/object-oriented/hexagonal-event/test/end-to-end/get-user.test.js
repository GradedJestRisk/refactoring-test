const httpClient = require('axios');
const chai = require('chai');
chai.should();

// Test helpers
const db = require('../../../../../test/database-helper');
const userMother = require('../helper/object-mother/user');

const baseUrl = 'http://localhost:3000/users/';

const RESPONSE_STATUS_CODE = {
  OK: 200,
  NOT_FOUND: 404
}

describe('End-to-end | getUser', async ()=> {

    beforeEach(async () => {
        await db.removeAll();
    });


    it('should return 200 when user does exists', async ()=>{

        // Arrange
        const dbUser = await userMother.createUser({});
        const requestUrl = baseUrl + dbUser.id;

        // Act
        const response = await httpClient.get(requestUrl);

        // Assert
        response.status.should.eq(RESPONSE_STATUS_CODE.OK);
        response.data.user.should.deep.eq(dbUser);

    });

    it('should return 404 when user does not exists', async ()=>{

        // Arrange
        const requestUrl = baseUrl + '-1';
        let response;

        // Act
        try {
            response = await httpClient.get(requestUrl);
        } catch  (error) {
            response = error.response;
        }

        // Assert
        response.status.should.eq(RESPONSE_STATUS_CODE.NOT_FOUND);

    });

})