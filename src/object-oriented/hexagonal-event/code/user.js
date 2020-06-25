const controller = require('./user-side/user-controller');

const changeEmail = async function ({id, newEmail}) {
    const messageBus = require('./server-side/unmanaged-dependencies/message-bus');
    const httpClient = require('axios');
    messageBus.setHttpClient(httpClient);
    return await controller.changeUserEmail({ messageBus, id, newEmail });
};

const getUser = async function (id) {
    return await controller.getUser(id);
};

module.exports = { changeEmail, getUser};