'use strict';

const mysqlService = require('../service/mysql');
const queries = require('../config/queries');

/**
 * Return all the notifications of the user.
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

    mysqlService.executeQuery(queries.getNotificationByUserId, [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Database Error.');
        }

        return res.send(results);
    });
};

/**
 * Mark a notification of the user as read.
 * 
 * @name all
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.session - User session data.
 * @param {Integer} req.session.id - User ID.
 * @param {Object} req.body - The body of the request.
 * @param {String} req.body.type - Type of the notification.
 * @param {String} req.body.idDetail - Notification ID. (La parte de detalle no esta muy clara en Doc)
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.update = (req, res, next) => {
    let userId = req.session.id;
    let notiId = req.body.idDetail; // Esto es una suposicion, no esta clara en la documentacion
    let type = req.body.type;

    let params = [
        { 
            read: 1,
            type: type
        },
        userId,
        notiId
    ];

    mysqlService.executeQuery(queries.updateNotification, params, (err, results) => {
        if (err) {
            return res.status(500).send('Database Error.');
        }

        return res.status(200).end;
    });
};