exports.up = function(knex, Promise) {
    return knex.schema.createTable('theatre_room', (t) => {
        t.increments('id').unsigned().primary();
        t.string('name', 200).notNull();
        t.integer('capacity').notNull();
        t.integer('black_camera').notNull();
        t.string('relevant_data', 200);
        t.string('profile_image', 250);
        t.string('scenic_space', 100);
        t.string('escenary_type', 45);
        t.integer('theatre_id').unsigned().notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('theatre_room');
};