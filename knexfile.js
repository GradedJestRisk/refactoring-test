module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'refactoring_test',
      port:     8432,
      user:     'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './knex/migrations',
    },
    seeds: {
      directory: './knex/seeds',
    },
  }

};
