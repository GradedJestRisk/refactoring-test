const chai = require('chai');
chai.should();

const knex = require('../../../../../../knex/knex');

class User{
    constructor(id) {
        this.id = id;
    }
    async fromDB(){
        const user = await knex('user').where('id', this.id).first();
        this.user = user;
        return this;
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

module.exports = User;