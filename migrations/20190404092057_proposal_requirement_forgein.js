exports.up = function(knex, Promise) {
    return knex.schema.table('proposal_requirement', function (table) {
        table.foreign('proposal_id').references('Proposal.id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('proposal_requirement', function (table) {
        table.dropForeign('proposal_id');
    });
};