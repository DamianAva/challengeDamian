module.exports = {
    getPaymentsById: `SELECT
        pay.id,
        pay.code,
        pay.theatre_id,
        pay.show_id,
        pay.date,
        pay.amount,
        pay.action_id,
        pay.status,
        payact.name
    FROM 
        payment AS pay
    LEFT JOIN
        payment_action AS payact ON pay.action_id = payact.id
    WHERE
        pay.user_id = ? AND pay.id = ?;`,
    
    getPaymentsByUserId: `SELECT
        pay.id,
        pay.code,
        pay.theatre_id,
        pay.show_id,
        pay.date,
        pay.amount,
        pay.action_id,
        pay.status,
        payact.name
    FROM 
        payment AS pay
    LEFT JOIN
        payment_action AS payact ON pay.action_id = payact.id
    WHERE
        pay.user_id = ?;`,
};