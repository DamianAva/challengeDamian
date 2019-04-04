exports.up = function(knex, Promise) {
    return knex.schema.table('notification', function (table) {
        table.foreign('user_id').references('User.id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('notification', function (table) {
        table.dropForeign('user_id');
    });
};
