exports.up = function(knex, Promise) {
    return knex.schema.table('event_requirement', function (table) {
        table.foreign('description_id').references('Requirement_description.id');
        table.foreign('event_id').references('Event.id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('event_requirement', function (table) {
        table.dropForeign('description_id');
        table.dropForeign('event_id');
    });
};