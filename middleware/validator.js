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
 * @param {Object} req.params - Session data of the user.
 * @param {Object} req.body - Session data of the user.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.validate = (route, req, res, next) => {
    if (route.auth && !req.session) {
        return res.status(500).send('You need a valid Token to continue.');
    }

    if (route.input.params) {
        for (const paramName in req.params) {
            if (!route.input.params[paramName]) {
                return res.status(500).send(`Invalid parameter "${paramName}"`);
            }

            let value = req.params[paramName];
            let routeConfig = route.input.params[paramName];

            let errorParam = validateValues(value, routeConfig);

            if (errorParam) {
                return res.status(500).send(`Param "${paramName}": ${errorParam}`);
            }
        }

        for (const routeParam in route.input.params) {
            let routeConfig = route.input.params[routeParam];

            if (!req.params[routeParam] && routeConfig.required) {
                return res.status(500).send(`Missing required parameter "${routeParam}"`);
            }
        }
    }

    if (route.input.body) {
        for (const bodyName in req.body) {
            if (!route.input.body[bodyName]) {
                return res.status(500).send(`Invalid body value "${bodyName}"`);
            }

            let value = req.body[bodyName];
            let routeConfig = route.input.body[bodyName];

            let errorBody = validateValues(value, routeConfig);

            if (errorBody) {
                return res.status(500).send(`Body value "${bodyName}": ${errorBody}`);
            }
        }

        for (const routeParam in route.input.body) {
            let routeConfig = route.input.body[routeParam];

            if (!req.body[routeParam] && routeConfig.required) {
                return res.status(500).send(`Missing required body value "${routeParam}"`);
            }
        }
    }

    return next();
};

/**
 * Tests if a value meets the requirements defined by the route.
 * 
 * @name validateValues
 * @function
 * @param {Object} value - Value to be tested.
 * @param {Object} routeConfig - Configuration paramaters of the route.
 * @return {String} Return an error if something fails or null if is valid.
 */
let validateValues = (value, routeConfig) => {
    if (!routeConfig.nulleable && value === null) {
        return 'Value can\'t be empty';
    }

    switch (routeConfig.type) {
        case 'string':
            return testString(value, routeConfig);
        case 'int':
            return testInteger(value, routeConfig);
        case 'number':
        case 'float':
            return testNumber(value, routeConfig);
        case 'object':
            return testObject(value, routeConfig);
    }

    return 'Bad config.';
};

/**
 * Tests if a value is a valid string.
 * 
 * @name testString
 * @function
 * @param {Object} value - Value to be tested.
 * @param {Object} routeConfig - Configuration paramaters of the route.
 * @return {String} Return an error if something fails or null if is valid.
 */
let testString = (value, routeConfig) => {
    if (!util.isString(value)) {
        return 'Invalid string.';
    }

    if (routeConfig.minLength && value.length < routeConfig.minLength) {
        return 'String length is lower than the minimum.';
    }

    if (routeConfig.maxLength && value.length > routeConfig.maxLength) {
        return 'String length is higher than the maximum.';
    }

    return null;
};

/**
 * Tests if a value is a valid number.
 * 
 * @name testNumber
 * @function
 * @param {Object} value - Value to be tested.
 * @param {Object} routeConfig - Configuration paramaters of the route.
 * @return {String} Return an error if something fails or null if is valid.
 */
let testNumber = (value, routeConfig) => {
    if (!util.isNumber(value)) {
        return 'Invalid number.';
    }

    if (routeConfig.minValue && value < routeConfig.minValue) {
        return 'Value is lower than the minimum.';
    }

    if (routeConfig.maxValue && value > routeConfig.maxValue) {
        return 'Value is higher than the maximum.';
    }

    return null;
};

/**
 * Tests if a value is a valid integer.
 * 
 * @name testInteger
 * @function
 * @param {Object} value - Value to be tested.
 * @param {Object} routeConfig - Configuration paramaters of the route.
 * @return {String} Return an error if something fails or null if is valid.
 */
let testInteger = (value, routeConfig) => {
    if (!util.isInteger(value)) {
        return 'Invalid number.';
    }

    if (routeConfig.minValue && value < routeConfig.minValue) {
        return 'Value is lower than the minimum.';
    }

    if (routeConfig.maxValue && value > routeConfig.maxValue) {
        return 'Value is higher than the maximum.';
    }

    return null;
};

/**
 * Tests if a value is a valid object.
 * 
 * @name testObject
 * @function
 * @param {Object} value - Value to be tested.
 * @param {Object} routeConfig - Configuration paramaters of the route.
 * @return {String} Return an error if something fails or null if is valid.
 */
let testObject = (value, routeConfig) => {
    if (!util.isObject(value)) {
        return 'Invalid object.';
    }

    return null;
};