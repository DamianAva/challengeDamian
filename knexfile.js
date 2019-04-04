module.exports = {
    development: {
        debug: true,
        client: 'mysql2',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'admin',
            database: 'test_knex'
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
