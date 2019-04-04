exports.up = function(knex, Promise) {
    return knex.schema.createTable('proposal', (t) => {
        t.increments('id').unsigned().primary();
        t.datetime('date').notNull();
        t.integer('status').notNull();
        t.text('message');
        t.integer('event_id').unsigned().notNull();
        t.integer('user_id').unsigned().notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('proposal');
};