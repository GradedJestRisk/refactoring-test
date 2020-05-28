const chai = require('chai');
chai.should();

const knex = require('../../../../../../knex/knex');

class Company{
    constructor() {
        this.company = {};
    }
    async fromDB(){
        this.company = await knex('company').first();
        return this;
    }
    shouldExists(){
        this.company.should.not.be.undefined;
        return this;
    }
    withEmployeeCount(count){
        this.company.numberOfEmployees.should.eq(count);
        return this;
    }

}

module.exports = Company;