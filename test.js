const knex = require('./knex/knex');
( async() => {
	
//	await knex.raw("CALL removeUser(1)") 

    const response = await knex.raw("SELECT changeuseremail(0,'a@a.com')");
    console.log('response');
    console.dir(response);

})();
