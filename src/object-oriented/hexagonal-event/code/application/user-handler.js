const controller = require('./user-controller');
const Boom = require('@hapi/boom');

const message = {
    SUCCESSFUL_EXECUTION: 'OK',
    EMAIL_IS_ALREADY_TAKEN: 'email is taken',
    USER_DOES_NOT_EXISTS: 'user does not exists'
}

module.exports = {
    async getUser(request, h) {
        console.dir(request.params.id);
        const id = parseInt(request.params.id);
        const data = await controller.getUser(id);

        if (data ===  message.USER_DOES_NOT_EXISTS) {
            throw Boom.notFound("User not found: " + id);
        }

        return h.response({
            user: data
        })
            .code(200)
            .header('Content-Type', 'application/json;charset=UTF-8')
    }
};