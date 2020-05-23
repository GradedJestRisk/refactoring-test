const chai = require('chai');
chai.should();

class messageBusSpy {

    constructor() {
        this.sentMessages = [];
    }

    propagateEmailChange(message) {
        this.sentMessages.push(message);
    };

    shouldSendNumberOfMessages(count) {
        this.sentMessages.length.should.eq(count);
        return this;
    };

    withEmailChangedMessage({id, newEmail}) {

        const expectedMessage = { id, newEmail };

        this.sentMessages.pop().should.deep.equal(expectedMessage);

        return this;

    };

}

module.exports = messageBusSpy;