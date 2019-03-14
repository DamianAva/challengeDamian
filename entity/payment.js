'use strict';

const mysqlService = require('../service/mysql');
const queries = require('../config/queries');

exports.get = () => {};

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

    mysqlService(queries.getNotificationsByUserId, [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Database Error.');
        }

        return res.send(results);
    });
};