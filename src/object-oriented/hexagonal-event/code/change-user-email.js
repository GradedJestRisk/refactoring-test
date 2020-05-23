const controller = require('./application/user-controller');
const messageBus = require('./infrastructure/unmanaged-dependencies/message-bus');

const changeUserEmail = async function ({id, newEmail}) {
    return await controller({ messageBus, id, newEmail });
};

module.exports = changeUserEmail;