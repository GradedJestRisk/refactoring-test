const changeUserEmail = require('./src/procedural/javascript/change-user-email');
const SUCCESS_RETURN_CODE = 0;

(async function () {
    await changeUserEmail({id: 0, newEmail: 'employee-one@this-corp.com'});
    process.exit(SUCCESS_RETURN_CODE);
})()