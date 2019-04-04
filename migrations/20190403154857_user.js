exports.up = function(knex, Promise) {
    return knex.schema.createTable('user', (t) => {
        t.increments('id').unsigned().primary();
        t.string('email', 200).notNull();
        t.string('password', 64).notNull();
        t.string('fullname', 250).notNull();
        t.string('phone', 100);
        t.integer('type').defaultTo(1).notNull();
        t.integer('responsability').defaultTo(1).notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user');
};