const chai = require('chai');
chai.should();

class UserAssertion{
    constructor(user) {
        this.user = user;
    }
    shouldExists(){
        this.user.should.not.be.undefined;
        return this;
    }
    withEmail(email){
        this.user.email.should.eq(email);
        return this;
    }
    withType(type){
        this.user.type.should.eq(type);
        return this;
    }

}

module.exports = UserAssertion;