exports.up = function(knex, Promise) {
    return knex.schema.createTable('event_image', (t) => {
        t.increments('id').unsigned().primary();
        t.string('src', 250).notNull();
        t.string('alt', 150).notNull();
        t.integer('event_id').unsigned().notNull();
        t.datetime('updated_at').notNull();
        t.datetime('created_at').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('event_image');
};