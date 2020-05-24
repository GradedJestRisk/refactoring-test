// This method create a  data transfer object, used to communicate between application and domain
const create = function ({userId, newEmail}) {
    return {userId, newEmail};
}

module.exports = {create};