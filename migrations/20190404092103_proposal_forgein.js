exports.up = function(knex, Promise) {
    return knex.schema.table('proposal', function (table) {
        table.foreign('event_id').references('Event.id');
        table.foreign('user_id').references('User.id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('proposal', function (table) {
        table.dropForeign('event_id');
        table.dropForeign('user_id');
    });
};