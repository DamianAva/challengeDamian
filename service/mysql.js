'use strict';

const mysql = require('mysql2');
const config = require('../config/config.js');

let pool = mysql.createPool(config.mysql);

/**
 * Gets a connection from the connections pool.
 * 
 * @name getConnection
 * @function
 * @param {Function} cb - Callback argument.
 */
exports.getConnection = (cb) => {
    pool.getConnection(function (err, conn) {
        return cb(err, conn);
    });
}

/**
 * Starts a transaction on a connection.
 * 
 * @name startTransaction
 * @function
 * @param {Object} conn - Connection to DB.
 * @param {Function} cb - Callback argument.
 */
exports.startTransaction = (conn, cb) => {
    conn.beginTransaction(function (err) {
        return cb(err);
    });
}

/**
 * Gets a connection, executes a query and closes it after it finish.
 * Useful when you only need to execute one single query without a transaction.
 * 
 * @name executeQuery
 * @function
 * @param {String} query - Query to be executed.
 * @param {Array} params - Parameters of the query.
 * @param {Function} cb - Callback argument.
 */
exports.executeQuery = (query, params, cb) => {
    pool.getConnection(function (err, conn) {
        if (err) {
            return cb(err);
        }
        
        conn.query(query, params, (err, results, fields) => {
            conn.release();

            return cb(err, results, fields);
        });
    });
}

/**
 * Commits a transaction.
 * 
 * @name commitTransaction
 * @function
 * @param {Object} conn - Connection to DB.
 * @param {Function} cb - Callback argument.
 */
exports.commitTransaction = (conn, cb) => {
    conn.commit(function (err) {
        if (err) {
            conn.rollback(function () {
                return cb(err);
            });
        } else {
            return cb();
        }
    });
}

/**
 * Cancels a transaction and rollback the changes.
 * 
 * @name commitTransaction
 * @function
 * @param {Object} conn - Connection to DB.
 * @param {Function} cb - Callback argument.
 */
exports.cancelTransaction = (conn, cb) => {
    conn.rollback(function () {
        return cb();
    });
}

/**
 * Closes a connection.
 * 
 * @name closeConnection
 * @function
 * @param {Object} conn - Connection to DB.
 */
exports.closeConnection = (conn) => {
    return conn.release();
}