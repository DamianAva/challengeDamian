exports.up = function(knex, Promise) {
    return knex.schema.table('payment', function (table) {
        table.foreign('theatre_id').references('Theatre.id');
        table.foreign('show_id').references('Show.id');
        table.foreign('action_id').references('Payment_action.id');
        table.foreign('user_id').references('User.id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('payment', function (table) {
        table.dropForeign('theatre_id');
        table.dropForeign('show_id');
        table.dropForeign('action_id');
        table.dropForeign('user_id');
    });
};