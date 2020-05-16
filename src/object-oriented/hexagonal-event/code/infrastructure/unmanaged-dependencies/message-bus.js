const axios = require('axios');

const url = 'http://httpbin.org/put';
const OK_RESPONSE_STATUS = 200;

const propagateEmailChange = async ({id, newEmail}) => {

    const message =
        {
            type: 'emailChangedEvent',
            userId: id,
            email: newEmail
        };

    const response = await axios({url, method: 'put', data: message});

//    console.log('Message sent: ');
//     console.dir(message);

    if (response.status !== OK_RESPONSE_STATUS) {
        throw new Error('Message has been rejected by ' + url);
        //console.log('Message rejected, response:' + response.status);
    }
    // else {
    //console.log('Message accepted');
    //}
};

module.exports = {propagateEmailChange};
