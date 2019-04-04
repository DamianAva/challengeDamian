exports.up = function(knex, Promise) {
    return knex.schema.table('theatre_room', function (table) {
        table.foreign('theatre_id').references('Theatre.id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('theatre_room', function (table) {
        table.dropForeign('theatre_id');
    });
};