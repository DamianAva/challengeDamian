'use strict';

const mysqlService = require('../../service/mysql');
const queries = require('./queries');

/**
 * Returns a payment of the user by ID.
 * 
 * @name get
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.params - The params of the request.
 * @param {Integer} req.params.id - Payment ID.
 * @param {Object} req.session - User session data.
 * @param {Integer} req.session.id - User ID.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.get = (req, res, next) => {
    let userId = req.session.id;
    let paymentId = req.params.id;

    mysqlService.executeQuery(queries.getPaymentsById, [userId, paymentId], (err, results) => {
        if (err) {
            return res.status(500).send('Database Error.');
        }

        if (!results.length) {
            return res.status(500).send('Can\'t find the payment.');
        }

        return res.send(results[0]);
    });
};

/**
 * Returns all the payments of the user.
 * 
 * @name all
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.session - User session data.
 * @param {Integer} req.session.id - User ID.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.all = (req, res, next) => {
    let userId = req.session.id;

    mysqlService.executeQuery(queries.getPaymentsByUserId, [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Internal Server Error.');
        }

        return res.send(results);
    });
};