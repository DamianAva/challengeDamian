exports.up = function(knex, Promise) {
    return knex.schema.createTable('payment', (t) => {
        t.increments('id').unsigned().primary();
        t.string('code', 45).notNull();
        t.integer('theatre_id').unsigned().notNull();
        t.integer('show_id').unsigned().notNull();
        t.datetime('date').notNull();
        t.float('amount').notNull();
        t.integer('action_id').unsigned().notNull();
        t.integer('status').notNull();
        t.integer('user_id').unsigned().notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('payment');
};