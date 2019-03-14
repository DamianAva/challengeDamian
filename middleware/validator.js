'use strict';

const util = require('../helper/util');

/**
 * Validates the input data and if the user has a token if required.
 * 
 * @name validate
 * @function
 * @param {Object} route - Configuration of the route.
 * @param {Object} req - The request object of Express.
 * @param {Object} req.session - Session data of the user.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.validate = (route, req, res, next) => {
    if (route.auth && !req.session) {
        return res.status(500).send('You need a valid Token to continue.');
    }

    /* Validar el input */

    return next();
};

let validateValues = () => {};