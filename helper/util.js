'use strict';

/**
 * Generates a random string.
 * 
 * @name generateString
 * @function
 * @param {Object} size - Size of the string to generate.
 * @returns {String} Generated string.
 */
exports.generateString = (size = 10) => {
    let text = '';
    var possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < size; i++) {
        text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }

    return text;
};

/**
 * Checks if a value is a string.
 * 
 * @name isString
 * @function
 * @param {} value - Value to test.
 * @returns {Boolean} Result of the test.
 */
exports.isString = (value) => {
    return typeof value === 'string' ? true : false;
};

/**
 * Checks if a value is a number.
 * 
 * @name isNumber
 * @function
 * @param {} value - Value to test.
 * @returns {Boolean} Result of the test.
 */
exports.isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Checks if a value is an integer.
 * 
 * @name isInteger
 * @function
 * @param {} value - Value to test.
 * @returns {Boolean} Result of the test.
 */
exports.isInteger = (value) => {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
};

/**
 * Checks if a value is an object.
 * 
 * @name isObject
 * @function
 * @param {} value - Value to test.
 * @returns {Boolean} Result of the test.
 */
exports.isObject = (value) => {
    return typeof value === 'object' && value !== null;
};