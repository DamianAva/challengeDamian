exports.up = function(knex, Promise) {
    return knex.schema.createTable('event', (t) => {
        t.increments('id').unsigned().primary();
        t.string('author', 200).notNull();
        t.integer('duration').notNull();
        t.string('director', 250).notNull();
        t.string('name', 250).notNull();
        t.string('profile_image', 250);
        t.datetime('premiere').notNull();
        t.integer('distance');
        t.integer('national_cachet');
        t.integer('international_cachet');
        t.integer('borderaux');
        t.string('cover_image', 250);
        t.string('trailer', 250);
        t.string('cast', 250).notNull();
        t.text('synteshis').notNull();
        t.string('city', 100).notNull();
        t.integer('genre').notNull();
        t.integer('public_type').notNull();
        t.integer('needed_people').notNull();
        t.integer('assembly_hours').notNull();
        t.integer('disassembly_hours').notNull();
        t.string('needed_space', 150).notNull();
        t.string('sound', 150).notNull();
        t.string('scenography', 150).notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('event');
};