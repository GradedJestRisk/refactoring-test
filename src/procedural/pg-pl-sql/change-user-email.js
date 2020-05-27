const knex = require('../../../knex/knex');

const changeUserEmail = async function ({id, newEmail}) {

    const query = 'SELECT change_user_email( p_id :=' + id + ',  p_new_email := \'' + newEmail + '\')';
    const response = await knex.raw(query);
    const message  = response.rows[0].change_user_email;
    return message;
}

module.exports = changeUserEmail;