const userExists = async function (transaction, id) {
    const USER_DOES_NOT_EXISTS_MESSAGE = 'user does not exists';

    const userCount = Number((await transaction('user').count('email').where({id}).first()).count);
    if (userCount === 0) {
        return USER_DOES_NOT_EXISTS_MESSAGE;
    } else {
        return null;
    }

}
const getUserById = async function (transaction, id) {
    return transaction('user').where({id}).first();
}

const isEmailAlreadyTaken = async function (transaction, email) {
    const EMAIL_IS_TAKEN_MESSAGE = 'email is taken';
    const emailCount = (await transaction('user').where({email}).count().first()).count;
    if (emailCount > 0) {
        return EMAIL_IS_TAKEN_MESSAGE;
    } else {
        return null;
    }
}

const saveUser = function (transaction, user) {
    return transaction('user').where({id: user.id}).update(user)
}

module.exports = {getUserById, isEmailAlreadyTaken, saveUser, userExists}