const User = require('../../../code/domain/User');
const Company = require('../../../code/domain/Company');
const EmailChangedEvent = require('../../../code/domain/EmailChangedEvent');

const chai = require('chai');
chai.should();

describe('changeEmail', () => {

    it('should do many things when changing email from corporate to non corporate', async () => {
        const company = new Company({domainName: 'mycorp.com', numberOfEmployees: 1});
        const sut = new User({id: 1, email: 'user@mycorp.com', type: 2, isEmailConfirmed: false});

        await sut.changeEmail("new@gmail.com", company);

        company.numberOfEmployees.should.eq(0);
        sut.email.should.eq("new@gmail.com");
        sut.type.should.eq(1);
        sut.emailChangedEvents.should.be.deep.equal([new EmailChangedEvent({userId: 1, newEmail: "new@gmail.com"})]);
    });

    it('should do many things when changing email from non corporate to corporate', async () => {
        const company = new Company({domainName: 'mycorp.com', numberOfEmployees: 0});
        const sut = new User({id: 1, email: 'new@gmail.com', type: 1, isEmailConfirmed: false});

        await sut.changeEmail("new@mycorp.com", company);

        company.numberOfEmployees.should.eq(1);
        sut.email.should.eq("new@mycorp.com");
        sut.type.should.eq(2);
        sut.emailChangedEvents.should.be.deep.equal([new EmailChangedEvent({userId: 1, newEmail: "new@mycorp.com"})]);
    });

    it('should do many things when changing email without changing user type', async () => {
        const company = new Company({domainName: 'mycorp.com', numberOfEmployees: 1});
        const sut = new User({id: 1, email: 'user@mycorp.com', type: 2, isEmailConfirmed: false});

        await sut.changeEmail('new@mycorp.com', company);

        company.numberOfEmployees.should.eq(1);
        sut.email.should.eq('new@mycorp.com');
        sut.type.should.eq(2);
        sut.emailChangedEvents.should.be.deep.equal([new EmailChangedEvent({userId: 1, newEmail: 'new@mycorp.com'})]);
    });

    it('not propagate change when changing email to the same one', async () => {
        const company = new Company({domainName: 'mycorp.com', numberOfEmployees: 1});
        const sut = new User({id: 1, email: 'user@mycorp.com', type: 2, isEmailConfirmed: false});

        await sut.changeEmail('user@mycorp.com', company);

        company.numberOfEmployees.should.eq(1);
        sut.email.should.eq('user@mycorp.com');
        sut.type.should.eq(2);
        sut.emailChangedEvents.should.be.deep.equal([]);
    });

});