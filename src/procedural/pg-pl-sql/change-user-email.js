const knex = require('../../../knex/knex');

const changeUserEmail = async function ({id, newEmail}) {
    const query = 'SELECT change_user_email( p_id :=' + id + ',  p_new_email := \'' + newEmail + '\')';
    //console.log('query: ' + query);
    const response = await knex.raw(query);
    //console.dir(response);
    const message  = response.rows[0].change_user_email;

    const DB_USER_NOT_FOUND = 'user not found';
    const JS_USER_NOT_FOUND = "Cannot read property 'email' of undefined";


    if (message === DB_USER_NOT_FOUND){
        throw new Error(JS_USER_NOT_FOUND);
    }

    return message
}

module.exports = changeUserEmail;