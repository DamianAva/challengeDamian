exports.up = function(knex, Promise) {
    return knex.schema.table('show', function (table) {
        table.foreign('event_id').references('Event.id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('show', function (table) {
        table.dropForeign('event_id');
    });
};