const User = require('../../../code/domain/User');
const Company = require('../../../code/domain/Company');
const emailChangedEvent = require('../../../code/shared/email-changed-event');

const chai = require('chai');
chai.should();


describe('unit | changeEmail', () => {

    it('should do many things when changing email from corporate to non corporate', async () => {
        const company = new Company({domainName: 'mycorp.com', numberOfEmployees: 1});
        const sut = new User({id: 1, email: 'user@mycorp.com', type: 2, isEmailConfirmed: false});

        sut.changeEmail("new@gmail.com", company);

        company.numberOfEmployees.should.eq(0);
        sut.email.should.eq("new@gmail.com");
        sut.type.should.eq(1);
        sut.emailChangedEvents.should.be.deep.equal([emailChangedEvent.create({userId: 1, newEmail: "new@gmail.com"})]);
    });

    it('should do many things when changing email from non corporate to corporate', async () => {
        const company = new Company({domainName: 'mycorp.com', numberOfEmployees: 0});
        const sut = new User({id: 1, email: 'new@gmail.com', type: 1, isEmailConfirmed: false});

        sut.changeEmail("new@mycorp.com", company);

        company.numberOfEmployees.should.eq(1);
        sut.email.should.eq("new@mycorp.com");
        sut.type.should.eq(2);
        sut.emailChangedEvents.should.be.deep.equal([emailChangedEvent.create({userId: 1, newEmail: "new@mycorp.com"})]);
    });

    it('should do many things when changing email without changing user type', async () => {
        const company = new Company({domainName: 'mycorp.com', numberOfEmployees: 1});
        const sut = new User({id: 1, email: 'user@mycorp.com', type: 2, isEmailConfirmed: false});

        sut.changeEmail('new@mycorp.com', company);

        company.numberOfEmployees.should.eq(1);
        sut.email.should.eq('new@mycorp.com');
        sut.type.should.eq(2);
        sut.emailChangedEvents.should.be.deep.equal([emailChangedEvent.create({userId: 1, newEmail: 'new@mycorp.com'})]);
    });

    it('not propagate change when changing email to the same one', async () => {
        const company = new Company({domainName: 'mycorp.com', numberOfEmployees: 1});
        const sut = new User({id: 1, email: 'user@mycorp.com', type: 2, isEmailConfirmed: false});

        sut.changeEmail('user@mycorp.com', company);

        company.numberOfEmployees.should.eq(1);
        sut.email.should.eq('user@mycorp.com');
        sut.type.should.eq(2);
        sut.emailChangedEvents.should.be.deep.equal([]);
    });

    it('should handle confirmed email', async () => {
        const emailAlreadyConfirmedMessage = 'can not change email after after its confirmation';
        const company = new Company({domainName: 'mycorp.com', numberOfEmployees: 1});
        const userData = {id: 1, email: 'user@mycorp.com', type: 2, isEmailConfirmed: true, emailChangedEvents: []};
        const sut = new User(userData);

        try {
            sut.changeEmail('user@mycorp.com', company);
        } catch (exception) {
            exception.message.should.eq(emailAlreadyConfirmedMessage)

        }
        sut.should.be.deep.equal(userData);

    });

});