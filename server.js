const knex = require('./knex/knex.js');

knex.raw('SELECT current_database() AS "databaseName"' ).then((status) => {
    console.log('Successfully connected to ' + status.rows[0].databaseName);
});
