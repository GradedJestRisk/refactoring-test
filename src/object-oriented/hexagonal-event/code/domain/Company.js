class Company {
    constructor({domainName, numberOfEmployees}) {
        this.domainName = domainName;
        this.numberOfEmployees = numberOfEmployees;
    }

    hire() {
        //Precondition.Requires(NumberOfEmployees + delta >= 0);
        this.numberOfEmployees++;
    }

    fire() {
        //Precondition.Requires(NumberOfEmployees + delta >= 0);
        this.numberOfEmployees--;
    }

    isEmailCorporate(email) {
        const emailDomain = email.split('@')[1];
        return emailDomain === this.domainName;
    }
}

module.exports = Company;