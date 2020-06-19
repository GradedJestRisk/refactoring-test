const userExists = async function (transaction, id) {
    const userCount = parseInt((await transaction('user').count('email').where({id}).first()).count);
    return userCount !== 0;
}

const getUserById = async function (transaction, id) {
    return transaction('user').where({id}).first();
}

const isEmailAlreadyTaken = async function ({transaction, id, email}) {
    const emailCount = parseInt((await transaction('user').where('id', '!=', id).andWhere('email', email).count().first()).count);
    return emailCount !== 0;
}

const saveUser = function (transaction, user) {
    return transaction('user').where({id: user.id}).update(user)
}

module.exports = {getUserById, isEmailAlreadyTaken, saveUser, userExists}