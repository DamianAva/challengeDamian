exports.up = function(knex, Promise) {
    return knex.schema.createTable('theatre_image', (t) => {
        t.increments('id').unsigned().primary();
        t.string('src', 250).notNull();
        t.string('alt', 150).notNull();
        t.integer('theatre_id').unsigned().notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('theatre_image');
};