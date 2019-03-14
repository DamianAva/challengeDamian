'use strict';

const mysqlService = require('../service/mysql');
const redisService = require('../service/redis');
const emailService = require('../service/email');
const config = require('../config/config');
const queries = require('../config/queries');
const util = require('../helper/util');
const crypto = require('crypto');

/**
 * Login an user in the system.
 * 
 * @name login
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.body - The body of the request.
 * @param {String} req.body.email - Email of the user.
 * @param {String} req.body.password - Password of the user.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    mysqlService.executeQuery(queries.getUserByEmailPassword, [email, hashedPassword], (err, results) => {
        if (err) {
            return res.status(500).send('Database Error.');
        }

        if (!results.length) {
            return res.status(500).send('User not found.');
        }

        let token = util.generateString(28);
        let result = results[0];

        redisService.insert(`TOKEN_${token}`, JSON.stringify(result), config.tokenTime, (err) => {
            if (err) {
                return res.status(500).send('Cache Error.');
            }

            let resp = {
                data: {
                    user: {
                        id: result.id,
                        type: result.type,
                        responsability: result.responsability
                    },
                    access_token: token
                },
                user: {
                    fullname: result.fullname,
                    email: email,
                    id: result.id,
                    type: result.type,
                    responsability: result.responsability
                },
                access_token: token
            };
    
            res.send(resp);
        });
    });
};

/**
 * Logout an user of the system.
 * 
 * @name logout
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.session - User session data.
 * @param {String} req.session.token - Token of the user.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.logout = (req, res, next) => {
    let token = req.session.token;

    redisService.delete(`TOKEN_${token}`, (err) => {
        if (err) {
            return res.status(500).send('Cache Error.');
        }

        return res.status(200).end();
    });
};

/**
 * Changes the password of the user.
 * 
 * @name changePassword
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.body - Body of the request.
 * @param {String} req.body.password - New password.
 * @param {Object} req.session - User session data.
 * @param {Integer} req.session.id - User ID.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.changePassword = (req, res, next) => {
    let password = req.body.password;
    let hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    let userId = req.session.id;

    let params = [
        { password: hashedPassword },
        userId
    ];

    mysqlService.executeQuery(queries.updateUser, params, (err, result) => {
        if (err || !result.affectedRows) {
            return res.status(500).send('Database Error.');
        }

        return res.status(200).end();
    });
};

/**
 * Reset the password of a user with an reset token.
 * 
 * @name resetPassword
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.body - Body of the request.
 * @param {String} req.body.password - New password.
 * @param {String} req.body.reset_token - Reset token sent to the user.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.resetPassword = (req, res, next) => {
    let password = req.body.password;
    let resetToken = req.body.reset_token;

    redisService.get(`RESET_${resetToken}`, (err, result) => {
        if (err) {
            return res.status(500).send('Cache Error.');
        }

        if (!result) {
            return res.status(500).send('Wrong code.');
        }

        let hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        let params = [
            { password: hashedPassword },
            result
        ];

        mysqlService.executeQuery(queries.updateUser, params, (err, result) => {
            if (err || !result.affectedRows) {
                return res.status(500).send('Database Error.');
            }

            redisService.delete(`RESET_${resetToken}`, (err, result) => {
                return res.status(200).end();
            });
        });
    });
};

/**
 * Updates information of the user.
 * 
 * @name updateAccount
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.body - Body of the request.
 * @param {String} req.body.fullname - New fullname.
 * @param {String} req.body.phone - New phone.
 * @param {Object} req.session - User session data.
 * @param {Integer} req.session.id - User ID.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.updateAccount = (req, res, next) => {
    let body = req.body; // El validador se encargara de validar de que no haya nada extra
    let userId = req.session.id;

    let params = [
        body,
        userId
    ];

    mysqlService.executeQuery(queries.updateUser, params, (err, result) => {
        if (err || !result.affectedRows) {
            return res.status(500).send('Database Error.');
        }

        return res.status(200).end();
    });
};

/**
 * Sends an email with a code so an user can reset their password.
 * 
 * @name updateAccount
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.body - Body of the request.
 * @param {String} req.body.email - Email of the user that forgeted the password.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.forgotPassword = (req, res, next) => {
    let email = req.body.email;

    mysqlService.executeQuery(queries.getUserByEmail, [email], (err, result) => {
        if (err) {
            return res.status(500).send('Database Error.');
        }

        if (!result[0]) {
            return res.status(500).send('The email doesn\'t exist.');
        }

        let resetToken = util.generateString(50);

        /* Guardar el token en Redis */
        redisService.insert(`RESET_${resetToken}`, result[0].id, config.resetTime, (err) => {
            if (err) {
                return res.status(500).send('Cache Error.');
            }

            let params = {
                from: 'echevarriadamian@gmail.com',
                to: email,
                subject: 'Password reset'
            };
    
            let content = `Your reset code is: ${resetToken}`;
    
            emailService.send(params, content, (err, info) => {
                if (err) {
                    return res.status(500).send('Error sending the email.');
                }
    
                return res.status(200).end();
            });
        });
    });
};