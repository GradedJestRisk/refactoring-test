const emailChangedEvent = require('../shared/email-changed-event');
const userType = {
    Customer: 1,
    Employee: 2
}

class User {
    constructor({id, email, type, isEmailConfirmed}) {
        this.id = id;
        this.email = email;
        this.type = type;
        this.isEmailConfirmed = isEmailConfirmed;
        this.emailChangedEvents = [];
    }

    canChangeEmail() {
        if (!this.isEmailConfirmed)
            return "Can't change email after it's confirmed";

        return null;
    };

    async changeEmail(newEmail, company) {
        //Precondition.Requires(CanChangeEmail() == null);

        if (this.email === newEmail)
            return;

        const newType = company.isEmailCorporate(newEmail)
            ? userType.Employee
            : userType.Customer;

        if (this.type !== newType) {
            if (this.type === userType.Customer) {
                company.hire();
            } else if (this.type === userType.Employee) {
                company.fire();
            }
            this.type = newType;
        }

        this.email = newEmail;
        this.emailChangedEvents.push(emailChangedEvent.create({userId: this.id, newEmail}));
    }
}

module.exports = User;
