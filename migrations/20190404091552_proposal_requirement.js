exports.up = function(knex, Promise) {
    return knex.schema.createTable('proposal_requirement', (t) => {
        t.increments('id').unsigned().primary();
        t.text('comment').notNull();
        t.integer('covered_level').notNull();
        t.integer('description_id').unsigned().notNull();
        t.integer('proposal_id').unsigned().notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('proposal_requirement');
};