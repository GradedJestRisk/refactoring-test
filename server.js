const sutPathProceduralDB = './src/procedural/pg-pl-sql/change-user-email.js';
const sutPathProceduralJS = './src/procedural/javascript/change-user-email.js';
const sutPathOOPHexagonalEventJS = './src/object-oriented/hexagonal-event/code/application/user-controller.js';

// Choose which implementation to execute
const sutPath =  sutPathOOPHexagonalEventJS;

const changeUserEmail = require(sutPath);

const SUCCESS_RETURN_CODE = 0;

(async function () {
    await changeUserEmail({id: 0, newEmail: 'employee-one@this-corp.com'});
    process.exit(SUCCESS_RETURN_CODE);
})()