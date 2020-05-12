const knex = require('../../knex/knex');

const changeUserEmail = async function ({id, newEmail}) {
    const query = 'SELECT change_user_email(' + id + ', \'' + newEmail + '\')';
    //console.log('query: ' + query);
    const response = await knex.raw(query);
    //console.dir(response);
    return response.rows[0].change_user_email;
}

module.exports = changeUserEmail;