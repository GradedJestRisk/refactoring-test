const EmailChangedEvent = require('./EmailChangedEvent');
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

        const newType = company.IsEmailCorporate(newEmail)
            ? userType.Employee
            : userType.Customer;

        if (this.type !== newType) {
            const delta = newType === userType.Employee ? 1 : -1;
            company.changeNumberOfEmployees(delta);
        }

        this.email = newEmail;
        this.type = newType;
        this.emailChangedEvents.push(new EmailChangedEvent({userId: this.id, newEmail}));
    }
}

module.exports = User;
