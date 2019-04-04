exports.up = function(knex, Promise) {
    return knex.schema.createTable('event_requirement', (t) => {
        t.increments('id').unsigned().primary();
        t.integer('covered_level').notNull();
        t.text('comment').notNull();
        t.integer('description_id').notNull().unsigned();
        t.integer('event_id').notNull().unsigned();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('event_requirement');
};