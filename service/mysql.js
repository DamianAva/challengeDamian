const mysql = require('mysql2');
const config = require('../config/config.js');

let pool = mysql.createPool(config.mysql);

exports.getConnection = (cb) => {
    pool.getConnection(function (err, conn) {
        return cb(err, conn);
    });
}

exports.startTransaction = (conn, cb) => {
    conn.beginTransaction(function (err) {
        return cb(err);
    });
}

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

exports.cancelTransaction = (conn, cb) => {
    conn.rollback(function () {
        return cb();
    });
}

exports.closeConnection = (conn) => {
    conn.release();
}