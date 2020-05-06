const sendEmailChange = function ( {id, newEmail}) {
    console.log('Message bus: emailChanged event emitted on user ' + id + ' (' + newEmail + ')');
};
module.exports = {sendEmailChange};