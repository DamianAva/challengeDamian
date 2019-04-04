exports.up = function(knex, Promise) {
    return knex.schema.createTable('payment_action', (t) => {
        t.increments('id').unsigned().primary();
        t.string('name', 45).notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('payment_action');
};