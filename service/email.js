'use strict';

const nodemailer = require('nodemailer');
const config = require('../config/config');

/**
 * Sends an email with the paramaters and content of it.
 * 
 * @name send
 * @function
 * @param {Object} params - Parameters of the email.
 * @param {String} content - HTML body of the email.
 * @param {Function} cb - Callback argument.
 */
exports.send = (params, content, cb) => {
    if (!params.from || !params.to || !params.subject || !content) {
        return cb({ err: 'Faltan datos' });
    }

    let mailOptions = {
        from: params.from,
        to: params.to,
        subject: params.subject,
        html: content
    };

    let transporter = nodemailer.createTransport(config.nodemailer);

    transporter.sendMail(mailOptions, (err, info, resp) => {
        return cb(err, info);
    });
};