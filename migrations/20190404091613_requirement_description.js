exports.up = function(knex, Promise) {
    return knex.schema.createTable('requirement_description', (t) => {
        t.increments('id').unsigned().primary();
        t.string('name', 45).notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('requirement_description');
};