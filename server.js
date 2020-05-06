const user = require('./src/user');

(async function () {
    await user.changeEmail({id: 0, newEmail: 'employee-one@this-corp.com'});
})()