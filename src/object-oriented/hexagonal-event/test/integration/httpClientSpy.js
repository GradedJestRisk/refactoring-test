const chai = require('chai');
chai.should();

const expectedUrl = 'http://httpbin.org/put';
const OK_RESPONSE_STATUS = 200;

class httpClientSpy {

    constructor() {
        this.sendRequests = [];
    }

    async put(url, message) {
        this.sendRequests.push({url, message});
        return {status: OK_RESPONSE_STATUS};
    };

    shouldSendNumberOfMessages(count) {
        this.sendRequests.length.should.eq(count);
        return this;
    };

    withEmailChangedMessage({id, newEmail}) {
        const expectedSendRequest = {
            url: expectedUrl,
            message: {
                type: 'emailChangedEvent',
                userId: id,
                email: newEmail
            }
        };

        const actualSendRequest = this.sendRequests.pop();

        actualSendRequest.should.deep.equal(expectedSendRequest);

        return this;

    };

}

module.exports = httpClientSpy;