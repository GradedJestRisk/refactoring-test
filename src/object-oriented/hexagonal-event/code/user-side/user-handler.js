const changeEmailController = require('../user')

const Boom = require('@hapi/boom');

const message = {
    EMAIL_IS_ALREADY_TAKEN: 'email is taken',
    EMAIL_ALREADY_CONFIRMED: 'can not change email after after its confirmation',
    SUCCESSFUL_EXECUTION: 'OK',
    USER_DOES_NOT_EXISTS: 'user does not exists'
}

const getUser = async function (request, h) {

    const id = parseInt(request.params.id);
    const data = await changeEmailController.getUser(id);

    if (data === message.USER_DOES_NOT_EXISTS) {
        throw Boom.notFound("User not found: " + id);
    }

    return h.response({
        user: data
    })
        .code(200)
        .header('Content-Type', 'application/json;charset=UTF-8')
}

const changeUserEmail = async function (request, h) {

    const userId = parseInt(request.payload.id);
    const email = request.payload.email;

    const data = await changeEmailController.changeEmail({
        id: userId,
        newEmail: email
    });

    if (data === message.EMAIL_IS_ALREADY_TAKEN) {
        throw Boom.badRequest("Email already taken: " + email);
    }

    if (data === message.EMAIL_ALREADY_CONFIRMED) {
        throw Boom.badRequest("User has already changed his email: " + userId);
    }

    if (data === message.USER_DOES_NOT_EXISTS) {
        throw Boom.notFound("User not found: " + userId);
    }
    return h.response({})
        .code(201)
}

module.exports = { getUser, changeUserEmail};
