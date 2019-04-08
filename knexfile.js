module.exports = {
    development: {
        debug: true,
        client: 'mysql2',
        connection: {
            host: process.env.CHALLENGE_KNEX_HOST || '127.0.0.1',
            user: process.env.CHALLENGE_KNEX_USER || 'root',
            password: process.env.CHALLENGE_KNEX_PASS || 'admin',
            database: process.env.CHALLENGE_KNEX_DB || 'test_knex'
        },
        migrations: {
            tableName: process.env.CHALLENGE_TABLE || 'knex_migrations'
        }
    }
};
