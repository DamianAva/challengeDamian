exports.up = function(knex, Promise) {
    return knex.schema.createTable('show', (t) => {
        t.increments('id').unsigned().primary();
        t.datetime('date').notNull();
        t.integer('event_id').unsigned().notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('show');
};