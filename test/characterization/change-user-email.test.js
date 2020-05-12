let sutPath;

const sutPathProceduralDB = '../../src/procedural-db/change-user-email';
const sutPathProceduralJS = '../../src/procedural-js/change-user-email';

if ( process.env.SUT === 'PROCEDURAL_JS' ){
    sutPath = sutPathProceduralJS;
} else if (process.env.SUT === 'PROCEDURAL_DB'){
    sutPath = sutPathProceduralDB;
} else {
    // used for interactive
   sutPath = sutPathProceduralDB;
}

 console.log('SUT is' + sutPath);

const changeUserEmail = require(sutPath);

const chai = require('chai');
const db = require('./database-helper');
const nock = require('nock')

const expect = chai.expect
chai.should();
chai.use(require('chai-as-promised'));

const userType = {Customer: 1, Employee: 2};

describe('when user exists', () => {

    beforeEach(async () => {
        await db.removeAllUsers();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    describe('and email is not taken', () => {

        it('email should be updated', async () => {

            const user = {id: 0, email: 'employee_one@this-corp.com', type: 2, isEmailConfirmed: true};
            const newEmail = 'employee-one@mycorp.com';
            await db.addUser(user);

            const emailUpdate = {id: user.id, newEmail};
            await changeUserEmail(emailUpdate);

            const actualUser = await db.getUser(user.id);
            actualUser.email.should.eq(newEmail);

        });

        it('email change should be propagated', async () => {

            const baseUrl = 'http://httpbin.org';
            const route = '/put';

            const OK_RESPONSE_STATUS = 200;

            const remoteAPICall = nock(baseUrl)
                .put(route)
                .reply(OK_RESPONSE_STATUS, {});

            const user = {id: 0, email: 'employee_one@this-corp.com', type: 2, isEmailConfirmed: true};
            const newEmail = 'employee-one@mycorp.com';
            await db.addUser(user);

            const emailUpdate = {id: user.id, newEmail};
            await changeUserEmail(emailUpdate);

            const actualUser = await db.getUser(user.id);
            remoteAPICall.isDone().should.be.true;
        });

        describe(' employee count must stay up-to-date', () => {

            beforeEach(() => {
                db.removeAllUsers();
                db.removeCompany();
                db.addCompany();
            });

            it('if email domain stay the same, employee count should stay the same', async () => {

                const user = {id: 0, email: 'user_one@this-corp.com', type: userType.Customer, isEmailConfirmed: true};
                await db.addUser(user);
                const newEmail = 'user-one@mthis-corp.com';
                const employeeCount = await db.getCompanyEmployeeCount();

                const emailUpdate = {id: user.id, newEmail};
                await changeUserEmail(emailUpdate);

                const actualEmployeeCount = await db.getCompanyEmployeeCount();
                actualEmployeeCount.should.eq(employeeCount);
            });

            it('if email is changed from not corporate to corporate, employee count should be incremented ', async () => {

                const user = {id: 0, email: 'user_one@that-corp.com', type: userType.Customer, isEmailConfirmed: true};
                await db.addUser(user);
                const newEmail = 'user_one@this-corp.com';
                const employeeCount = await db.getCompanyEmployeeCount();

                const emailUpdate = {id: user.id, newEmail};
                await changeUserEmail(emailUpdate);

                const actualEmployeeCount = await db.getCompanyEmployeeCount();
                actualEmployeeCount.should.eq(employeeCount + 1);

            });

            it('if email is changed from corporate to not corporate, employee count should be decremented', async () => {

                const user = {id: 0, email: 'user_one@this-corp.com', type: userType.Employee, isEmailConfirmed: true};
                await db.addUser(user);
                const employeeCount = await db.getCompanyEmployeeCount();
                const newEmail = 'user_one@that-corp.com';
                const emailUpdate = {id: user.id, newEmail};

                await changeUserEmail(emailUpdate);

                const actualEmployeeCount = await db.getCompanyEmployeeCount();
                actualEmployeeCount.should.eq(employeeCount - 1);

            });

        });
    });

    describe('and email is taken', () => {

        it('it should return a message', async () => {

            const user = {id: 0, email: 'employee_one@this-corp.com', type: 2, isEmailConfirmed: true};
            const newEmail = 'employee-one@mycorp.com';
            const userSameEmail = {id: 1, email: newEmail, type: 2, isEmailConfirmed: true};
            await db.addUsers([user, userSameEmail]);

            const emailUpdate = {id: user.id, newEmail};
            const response = await changeUserEmail(emailUpdate);

            response.should.eq('Email is taken');
        });

        it('email should not be updated', async () => {

            const user = {id: 0, email: 'employee_one@this-corp.com', type: 2, isEmailConfirmed: true};
            const newEmail = 'employee-one@mycorp.com';
            const userSameEmail = {id: 1, email: newEmail, type: 2, isEmailConfirmed: true};
            await db.addUsers([user, userSameEmail]);

            const emailUpdate = {id: user.id, newEmail};
            await changeUserEmail(emailUpdate);

            const actualUser = await db.getUser(user.id);
            actualUser.email.should.eq(user.email);
        });
    });
});

describe('when users does not exists', () => {

    beforeEach(async () => {
        await db.removeAllUsers();
    });

    it('should throw, but does not (bug)', async () => {
        await db.removeAllUsers();
        const newEmail = 'employee-one@mycorp.com';
        const emailUpdate = {id: 1, newEmail};

        await expect(changeUserEmail(emailUpdate)).to.be.rejected;
    });
});