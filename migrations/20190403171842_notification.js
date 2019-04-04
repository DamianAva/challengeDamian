exports.up = function(knex, Promise) {
    return knex.schema.createTable('notification', (t) => {
        t.increments('id').unsigned().primary();
        t.integer('type').notNull();
        t.string('text', 250).notNull();
        t.integer('read').notNull();
        t.datetime('date').notNull();
        t.integer('user_id').unsigned().notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('notification');
};
