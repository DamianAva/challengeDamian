'use strict';

const nodemailer = require('nodemailer');
const config = require('../config/config');

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