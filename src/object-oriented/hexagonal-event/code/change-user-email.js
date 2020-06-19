const controller = require('./user-side/user-controller').changeUserEmail;
const messageBus = require('./server-side/unmanaged-dependencies/message-bus');
const httpClient = require('axios');
messageBus.setHttpClient(httpClient);

const changeUserEmail = async function ({id, newEmail}) {
    return await controller({ messageBus, id, newEmail });
};

module.exports = changeUserEmail;