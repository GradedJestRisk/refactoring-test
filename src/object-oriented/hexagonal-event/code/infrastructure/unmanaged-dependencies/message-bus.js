const url = 'http://httpbin.org/put';
const OK_RESPONSE_STATUS = 200;

let _httpClient;

const setHttpClient = function (httpClient) {
    _httpClient = httpClient;
}
const propagateEmailChange = async ({id, newEmail}) => {

    const message =
        {
            type: 'emailChangedEvent',
            userId: id,
            email: newEmail
        };

    const response = await _httpClient.put(url, message);

    if (response.status !== OK_RESPONSE_STATUS) {
        throw new Error('Message has been rejected by ' + url);
    }
};

module.exports = {setHttpClient, propagateEmailChange};
