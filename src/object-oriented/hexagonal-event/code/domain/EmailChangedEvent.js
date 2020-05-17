class EmailChangedEvent {
    constructor({userId, newEmail}) {
        this.userId = userId;
        this.newEmail = newEmail;
    }
}

module.exports = EmailChangedEvent;