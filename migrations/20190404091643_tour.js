exports.up = function(knex, Promise) {
    return knex.schema.createTable('tour', (t) => {
        t.increments('id').unsigned().primary();
        t.integer('active').notNull();
        t.integer('country').notNull();
        t.integer('limit_country').notNull();
        t.integer('world').notNull();
        t.integer('distance').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tour');
};