const chai = require('chai');
chai.should();

// SUT
const mut = require('../../code/user-side/user-controller').getUser;

// Test helpers
const db = require('../../../../../test/database-helper');
const userMother = require('../helper/object-mother/user');

// Constants
const message = {
    USER_DOES_NOT_EXISTS: 'user does not exists'
}

describe('integration | getUser', () => {

    beforeEach(async () => {
        await db.removeAll();
    });

    it('should return user', async () => {

        // Arrange
        const dbUser = await userMother.createUser({});

        // Act
        const responseUser = await mut(dbUser.id);

        // Assert
        responseUser.should.deep.equal(dbUser);

    });

    it('should reject request on non-existing user ', async () => {

        // Arrange
        const userId = 0;

        // Act
        const response = await mut(userId);

        // Assert
        response.should.eq(message.USER_DOES_NOT_EXISTS);

    });
});