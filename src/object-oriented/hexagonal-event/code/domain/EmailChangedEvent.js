class EmailChangedEvent {
    constructor({userId, newEmail}) {
        this.userId = userId;
        this.newEmail = newEmail;
    }

    equals(other) {
        return (this.userId === other.userId && this.newEmail === other.newEmail);
    }
}

module.exports = EmailChangedEvent;