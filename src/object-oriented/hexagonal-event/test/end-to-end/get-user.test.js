const httpClient = require('axios');
const chai = require('chai');
chai.should();

// Test helpers
const db = require('./../../../../../test/characterization/database-helper');
const userMother = require('../integration/object-mother/user');

const baseUrl = 'http://localhost:3000/users/';

const RESPONSE_STATUS_CODE = {
  OK: 200,
  NOT_FOUND: 404
}

describe('End-to-end | getUser', async ()=> {

    it('should return 200 when user does exists', async ()=>{

        // Arrange
        const dbUser = await userMother.createUser({});

        const requestUrl = baseUrl + dbUser.id;
        let response;

        try {
            response = await httpClient.get(requestUrl);
        } catch  (error) {
            console.log(error)
            response = error.response;
        }

        response.status.should.eq(RESPONSE_STATUS_CODE.OK);

    });

    it('should return 404 when user does not exists', async ()=>{

        const requestUrl = baseUrl + '-1';
        let response;

        try {
            response = await httpClient.get(requestUrl);
        } catch  (error) {
            response = error.response;
        }

        response.status.should.eq(RESPONSE_STATUS_CODE.NOT_FOUND);

    });

})