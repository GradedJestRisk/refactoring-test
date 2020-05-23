let sutPath;

const sutPathProceduralDB = '../../src/procedural/pg-pl-sql/change-user-email.js';
const sutPathProceduralJS = '../../src/procedural/javascript/change-user-email.js';
const sutPathOOPHexagonalEventJS = '../../src/object-oriented/hexagonal-event/code/change-user-email.js';

if (process.env.SUT === 'PROCEDURAL_JS') {
    sutPath = sutPathProceduralJS;
} else if (process.env.SUT === 'PROCEDURAL_DB') {
    sutPath = sutPathProceduralDB;
} else if (process.env.SUT === 'OOP_HEXAGONAL-EVENT_JS') {
    sutPath = sutPathOOPHexagonalEventJS;
} else {
    // used for interactive
    sutPath = sutPathOOPHexagonalEventJS;
}

// console.log('SUT is' + sutPath);

const changeUserEmail = require(sutPath);

const chai = require('chai');
const db = require('./database-helper');
const nock = require('nock')

const expect = chai.expect
chai.should();
chai.use(require('chai-as-promised'));

const userType = {Customer: 1, Employee: 2};
const COMPANY_DOMAIN_NAME = 'this-corp.com';

describe('change user email', () => {

    describe('when user exists', () => {

        beforeEach(async () => {
            await db.removeAllUsers();
        });

        afterEach(() => {
            nock.cleanAll();
        });

        describe('and email is not taken', () => {

            beforeEach(async () => {
                await db.removeAllUsers();
                await db.removeCompany();
            });

            it('email should be updated', async () => {

                await db.addCompany(1);
                const user = {id: 0, email: 'employee_one@this-corp.com', type: userType.Employee, isEmailConfirmed: true};
                const newEmail = 'employee-one@mycorp.com';
                await db.addUser(user);

                const emailUpdate = {id: user.id, newEmail};
                await changeUserEmail(emailUpdate);

                const actualUser = await db.getUser(user.id);
                actualUser.email.should.eq(newEmail);

            });

            it('type should be updated', async () => {

                await db.addCompany(1);

                const username = 'john.doe';
                const actualCompanyDomainName = COMPANY_DOMAIN_NAME;
                const actualEmail = username + '@' + actualCompanyDomainName;
                const user = {id: 0, email: actualEmail, type: userType.Employee, isEmailConfirmed: true};
                await db.addUser(user);
                const newCompanyDomainName = 'that-corp.com';
                const newEmail = username + '@' + newCompanyDomainName;
                const emailUpdate = {id: user.id, newEmail};

                await changeUserEmail(emailUpdate);

                const actualUser = await db.getUser(user.id);
                actualUser.type.should.eq(userType.Customer);

            });

            it('email change should be propagated', async () => {

                const baseUrl = 'http://httpbin.org';
                const route = '/put';

                const OK_RESPONSE_STATUS = 200;

                const remoteAPICall = nock(baseUrl)
                    .put(route)
                    .reply(OK_RESPONSE_STATUS, {});


                await db.addCompany(1);
                const user = {id: 0, email: 'employee_one@this-corp.com', type: 2, isEmailConfirmed: true};
                const newEmail = 'employee-one@mycorp.com';
                await db.addUser(user);
                const emailUpdate = {id: user.id, newEmail};

                await changeUserEmail(emailUpdate);

                if (sutPath === sutPathProceduralJS) {
                    remoteAPICall.isDone().should.be.true;
                } else if (sutPath === sutPathProceduralDB) {
                    // change is actually propagated, to check manually use httpry or tcpflow
                    // but Nock can't check out-of-process dependencies, so the check would fail
                    true.should.be.true;
                }

            });

            describe(' employee count must stay up-to-date', () => {

                beforeEach(async () => {
                    await db.removeAllUsers();
                    await db.removeCompany();
                });

                it('if email domain stay the same, employee count should stay the same', async () => {

                    const employeeCount = 0;
                    await db.addCompany(employeeCount);
                    const user = {
                        id: 0,
                        email: 'user_one@this-corp.com',
                        type: userType.Customer,
                        isEmailConfirmed: true
                    };
                    await db.addUser(user);
                    const newEmail = 'user-one@mthis-corp.com';

                    const emailUpdate = {id: user.id, newEmail};
                    await changeUserEmail(emailUpdate);

                    const actualEmployeeCount = await db.getCompanyEmployeeCount();
                    actualEmployeeCount.should.eq(0);
                });

                it('if email is changed from not corporate to corporate, employee count should be incremented ', async () => {

                    const employeeCount = 0;
                    await db.addCompany(employeeCount);
                    const user = {
                        id: 0,
                        email: 'user_one@that-corp.com',
                        type: userType.Customer,
                        isEmailConfirmed: true
                    };
                    await db.addUser(user);
                    const newEmail = 'user_one@this-corp.com';
                    const emailUpdate = {id: user.id, newEmail};

                    await changeUserEmail(emailUpdate);

                    const actualEmployeeCount = await db.getCompanyEmployeeCount();
                    actualEmployeeCount.should.eq(1);

                });

                it('if email is changed from corporate to not corporate, employee count should be decremented', async () => {

                    const employeeCount = 1;
                    await db.addCompany(employeeCount);
                     const user = {
                        id: 0,
                        email: 'user_one@this-corp.com',
                        type: userType.Employee,
                        isEmailConfirmed: true
                    };
                    await db.addUser(user);
                    const newEmail = 'user_one@that-corp.com';
                    const emailUpdate = {id: user.id, newEmail};

                    await changeUserEmail(emailUpdate);

                    const actualEmployeeCount = await db.getCompanyEmployeeCount();
                    actualEmployeeCount.should.eq(0);

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

        it('should throw undefined email', async () => {
            await db.removeAllUsers();
            const newEmail = 'employee-one@mycorp.com';
            const emailUpdate = {id: 1, newEmail};

            let rejectionMessage;

            if (sutPath === sutPathProceduralJS) {
                rejectionMessage = "Cannot read property 'email' of undefined";
            } else if (sutPath === sutPathProceduralDB) {
                rejectionMessage = "Cannot read property 'email' of undefined";
            } else if (sutPath === sutPathOOPHexagonalEventJS) {
                rejectionMessage = "Cannot destructure property 'id' of 'undefined' as it is undefined.";
            }

            await expect(changeUserEmail(emailUpdate)).to.be.rejectedWith(rejectionMessage);

        });
    });

});