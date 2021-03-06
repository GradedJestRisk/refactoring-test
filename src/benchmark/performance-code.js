let changeUserEmail;

const codePath = {
    oopHexagonal: '../../src/object-oriented/hexagonal-event/code/user.js',
    proceduralDB: '../../src/procedural/pg-pl-sql/change-user-email.js',
    proceduralJS: '../../src/procedural/javascript/change-user-email.js'
}

const codeImplementation = process.env.SUT;

if (codeImplementation === 'PROCEDURAL_JS') {
    changeUserEmail = require(codePath.proceduralJS);
} else if (codeImplementation === 'PROCEDURAL_DB') {
    changeUserEmail = require(codePath.proceduralDB);
} else if (codeImplementation === 'OOP_HEXAGONAL-EVENT_JS') {
    changeUserEmail = require(codePath.oopHexagonal).changeEmail;
} else {
    // used for interactive
    changeUserEmail = require(codePath.proceduralJS);
}

const MILLISECONDS_IN_SECONDS = 1000;
const ITERATION_COUNT = 100;

const db = require('../../test/database-helper');
const userType = {Customer: 1, Employee: 2};

const message = {
    SUCCESSFUL_EXECUTION: 'OK'
};

// IIAFE
(async () => {

    console.log('#################################################################################################');
    console.log('Executing ' + codeImplementation + ' implementation ' + ITERATION_COUNT + ' times');

    let actualMessage;
    const firstEmail = 'employee_three@this-corp.com';
    const secondEmail = 'employee-three@this-corp.com';
    let currentEmail = firstEmail;

    const user = {id: 3, email: firstEmail, type: userType.Employee, isEmailConfirmed: false};
    await db.addUser(user);

    const beginDate = Date.now();

    for (let i = 0; i < ITERATION_COUNT; i++) {

        if (currentEmail === firstEmail) {
            currentEmail = secondEmail;
        } else {
            currentEmail = firstEmail;
        }

        actualMessage = await changeUserEmail({id: user.id, newEmail: currentEmail});
        if (actualMessage && actualMessage !== message.SUCCESSFUL_EXECUTION) {
            throw actualMessage;
        }
    }

    const elapsedTotal = Date.now() - beginDate;
    const elapsedAverageMilliseconds = elapsedTotal / ITERATION_COUNT;
    console.log('average elapsed (ms): ' + elapsedAverageMilliseconds);

    const elapsedAverageSeconds = elapsedAverageMilliseconds / MILLISECONDS_IN_SECONDS;

    // https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
    const elapsedAverageRounded = Math.round((elapsedAverageSeconds + Number.EPSILON) * 100) / 100;

    console.log('average elapsed (s): ' + elapsedAverageRounded);

    process.exit(0);

})()



