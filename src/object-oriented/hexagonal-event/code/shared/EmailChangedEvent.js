// This class is a data access object, used to communicate between application and domain
class EmailChangedEvent {
    constructor({userId, newEmail}) {
        this.userId = userId;
        this.newEmail = newEmail;
    }
}

module.exports = EmailChangedEvent;