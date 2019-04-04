exports.up = function(knex, Promise) {
    return knex.schema.createTable('theatre', (t) => {
        t.increments('id').unsigned().primary();
        t.string('name', 200).notNull();
        t.string('address', 250).notNull();
        t.string('phone', 50);
        t.string('site_url', 250);
        t.text('history');
        t.string('email', 250);
        t.string('country', 100);
        t.string('province', 100);
        t.string('city', 100);
        t.string('profile_image', 250);
        t.string('cover_image', 250);
        t.integer('circuit_type').notNull();
        t.integer('user_id').unsigned().notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('theatre');
};