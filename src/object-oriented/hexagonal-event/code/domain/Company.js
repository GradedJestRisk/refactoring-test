class Company {
    constructor({domainName, numberOfEmployees}) {
        this.domainName = domainName;
        this.numberOfEmployees = numberOfEmployees;
    }

    changeNumberOfEmployees(delta) {
        //Precondition.Requires(NumberOfEmployees + delta >= 0);
        this.numberOfEmployees += delta;
    }

    IsEmailCorporate(email) {
        const emailDomain = email.split('@')[1];
        return emailDomain === this.domainName;
    }
}

module.exports = Company;