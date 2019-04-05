'use strict';

const sinon = require('sinon');
const { expect } = require('chai');
const redisService = require('../../service/redis');
const emailService = require('../../service/email');
const proxyquire = require('proxyquire').noCallThru();

let fakeQueries = {
    getUserByEmailPassword: function () {
        return [null, []];
    },
    updateUser: function () {
        return [null, {}];
    },
    getUserByEmail: function () {
        return [null, []];
    },
    
    insertUser: function () {
        return [null, {}];
    },
    insertTheatre: function () {
        return [null, {}];
    }
};

let fakeExecuteQuery = function (query, cb) {
    return cb(...fakeQueries[query]());
};

let user = proxyquire('../../entity/user/controller.js', {
    './queries': {
        getUserByEmailPassword: 'getUserByEmailPassword',
        updateUser: 'updateUser',
        getUserByEmail: 'getUserByEmail',
        insertUser: 'insertUser',
        insertTheatre: 'insertTheatre'
    },
    '../../service/mysql': {
        executeQuery: function(query, params, cb) {
            return fakeExecuteQuery(query, cb);
        }
    }
});

describe('entity.user', function () { /* Es preferible no utilizar arrow functions por el contexto que usa Mocha */
    describe('login', function() {
        let sandbox = sinon.createSandbox();
        let errorGetUserByEmailPassword = false;
        let emptyGetUserByEmailPassword = false;
        let errorRedis = false;

        beforeEach(function () {
            errorGetUserByEmailPassword = false;
            emptyGetUserByEmailPassword = false;
            errorRedis = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'getUserByEmailPassword').callsFake(function () {
                if (errorGetUserByEmailPassword) {
                    return [true];
                }

                if (emptyGetUserByEmailPassword) {
                    return [null, []];
                }

                return [null, [
                    {
                        id: 1,
                        type: 1,
                        responsability: 1,
                        fullname: 'Nombre Completo',
                        email: 'email@email.com'
                    }
                ]];
            });

            sandbox.stub(redisService, 'insert').callsFake(function (key, value, ttl, cb) {
                if (errorRedis) {
                    return cb(true);
                }

                return cb(null);
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Normal flow', function (done) {
            let req = {
                body: {
                    email: 'email@email.com',
                    password: 'password'
                }
            };

            let res = {
                status: function(status) {
                    return res;
                },
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.an('Object');
                    expect(resp).to.have.property('data');
                    expect(resp.data).to.have.property('user');
                    expect(resp.data.user).to.have.property('id', 1);
                    expect(resp.data.user).to.have.property('type', 1);
                    expect(resp.data.user).to.have.property('responsability', 1);
                    expect(resp.data).to.have.property('access_token');
                    expect(resp).to.have.property('user');
                    expect(resp.user).to.have.property('id', 1);
                    expect(resp.user).to.have.property('type', 1);
                    expect(resp.user).to.have.property('responsability', 1);
                    expect(resp.user).to.have.property('fullname', 'Nombre Completo');
                    expect(resp.user).to.have.property('email', 'email@email.com');
                    expect(resp).to.have.property('access_token');
                    done();
                }
            };

            user.login(req, res, null);
        });

        it('Database Error', function (done) {
            let req = {
                body: {
                    email: 'email@email.com',
                    password: 'password'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorGetUserByEmailPassword = true;

            user.login(req, res, null);
        });

        it('User not found', function (done) {
            let req = {
                body: {
                    email: 'email@email.com',
                    password: 'password'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('User not found.');
                    done();
                }
            };

            emptyGetUserByEmailPassword = true;

            user.login(req, res, null);
        });

        it('Cache Error', function (done) {
            let req = {
                body: {
                    email: 'email@email.com',
                    password: 'password'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Cache Error.');
                    done();
                }
            };

            errorRedis = true;

            user.login(req, res, null);
        });
    });

    describe('logout', function() {
        let sandbox = sinon.createSandbox();
        let errorRedis = false;

        beforeEach(function () {
            errorRedis = false;
        });

        before(function () {
            sandbox.stub(redisService, 'delete').callsFake(function (key, cb) {
                if (errorRedis) {
                    return cb(true);
                }

                return cb(null);
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Normal flow', function (done) {
            let req = {
                session: {
                    token: 'AAAAA'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(200);
                    return res;
                },
                end: function () {
                    done();
                }
            };

            user.logout(req, res, null);
        });

        it('Cache Error', function (done) {
            let req = {
                session: {
                    token: 'AAAAA'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Cache Error.');
                    done();
                }
            };

            errorRedis = true;

            user.logout(req, res, null);
        });
    });

    describe('changePassword', function() {
        let sandbox = sinon.createSandbox();
        let errorUpdateUser = false;

        beforeEach(function () {
            errorUpdateUser = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'updateUser').callsFake(function () {
                if (errorUpdateUser) {
                    return [true];
                }

                return [null, { affectedRows: 1 }];
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Normal flow', function (done) {
            let req = {
                body: {
                    password: 'password'
                },
                session: {
                    id: 1
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(200);
                    return res;
                },
                end: function () {
                    done();
                }
            };

            user.changePassword(req, res, null);
        });

        it('Database Error', function (done) {
            let req = {
                body: {
                    password: 'password'
                },
                session: {
                    id: 1
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorUpdateUser = true;

            user.changePassword(req, res, null);
        });
    });

    describe('resetPassword', function() {
        let sandbox = sinon.createSandbox();
        let errorUpdateUser = false;
        let errorRedis = false;
        let emptyRedis = false;

        beforeEach(function () {
            errorUpdateUser = false;
            errorRedis = false;
            emptyRedis = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'updateUser').callsFake(function () {
                if (errorUpdateUser) {
                    return [true];
                }

                return [null, { affectedRows: 1 }];
            });

            sandbox.stub(redisService, 'get').callsFake(function (key, cb) {
                if (errorRedis) {
                    return cb(true);
                }

                if (emptyRedis) {
                    return cb(null, null);
                }

                return cb(null, '1');
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Normal flow', function (done) {
            let req = {
                body: {
                    password: 'password',
                    reset_token: 'AAAAA'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(200);
                    return res;
                },
                end: function () {
                    done();
                }
            };

            user.resetPassword(req, res, null);
        });

        it('Cache Error', function (done) {
            let req = {
                body: {
                    password: 'password',
                    reset_token: 'AAAAA'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Cache Error.');
                    done();
                }
            };

            errorRedis = true;

            user.resetPassword(req, res, null);
        });

        it('Wrong code', function (done) {
            let req = {
                body: {
                    password: 'password',
                    reset_token: 'AAAAA'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Wrong code.');
                    done();
                }
            };

            emptyRedis = true;

            user.resetPassword(req, res, null);
        });

        it('Database Error', function (done) {
            let req = {
                body: {
                    password: 'password',
                    reset_token: 'AAAAA'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorUpdateUser = true;

            user.resetPassword(req, res, null);
        });
    });

    describe('updateAccount', function() {
        let sandbox = sinon.createSandbox();
        let errorUpdateUser = false;

        beforeEach(function () {
            errorUpdateUser = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'updateUser').callsFake(function () {
                if (errorUpdateUser) {
                    return [true];
                }

                return [null, { affectedRows: 1 }];
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Normal flow', function (done) {
            let req = {
                body: {
                    fullname: 'Nombre completo',
                    phone: 'Telefono'
                },
                session: {
                    id: 1
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(200);
                    return res;
                },
                end: function () {
                    done();
                }
            };

            user.updateAccount(req, res, null);
        });

        it('Database Error', function (done) {
            let req = {
                body: {
                    fullname: 'Nombre completo',
                    phone: 'Telefono'
                },
                session: {
                    id: 1
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorUpdateUser = true;

            user.updateAccount(req, res, null);
        });
    });

    describe('forgotPassword', function() {
        let sandbox = sinon.createSandbox();
        let errorRedis = false;
        let errorEmail = false;
        let errorGetUserByEmail = false;
        let emptyGetUserByEmail = false;

        beforeEach(function () {
            errorRedis = false;
            errorEmail = false;
            errorGetUserByEmail = false;
            emptyGetUserByEmail = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'getUserByEmail').callsFake(function () {
                if (errorGetUserByEmail) {
                    return [true];
                }
    
                if (emptyGetUserByEmail) {
                    return [null, []];
                }
    
                return [null, [
                    {
                        id: 1,
                        type: 1,
                        responsability: 1,
                        fullname: 'Nombre Completo',
                        email: 'email@email.com'
                    }
                ]];
            });
    
            sandbox.stub(redisService, 'insert').callsFake(function (key, value, ttl, cb) {
                if (errorRedis) {
                    return cb(true);
                }
    
                return cb(null);
            });
    
            sandbox.stub(emailService, 'send').callsFake(function (params, content, cb) {
                if (errorEmail) {
                    return cb(true);
                }
    
                return cb(null, { info: 'info' });
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Normal flow', function (done) {
            let req = {
                body: {
                    email: 'email@email.com'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(200);
                    return res;
                },
                end: function () {
                    done();
                }
            };

            user.forgotPassword(req, res, null);
        });

        it('Database Error', function (done) {
            let req = {
                body: {
                    email: 'email@email.com'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorGetUserByEmail = true;

            user.forgotPassword(req, res, null);
        });

        it('The email doesn\'t exist', function (done) {
            let req = {
                body: {
                    email: 'email@email.com'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('The email doesn\'t exist.');
                    done();
                }
            };

            emptyGetUserByEmail = true;

            user.forgotPassword(req, res, null);
        });

        it('Cache Error', function (done) {
            let req = {
                body: {
                    email: 'email@email.com'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Cache Error.');
                    done();
                }
            };

            errorRedis = true;

            user.forgotPassword(req, res, null);
        });

        it('Error sending the email', function (done) {
            let req = {
                body: {
                    email: 'email@email.com'
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Error sending the email.');
                    done();
                }
            };

            errorEmail = true;

            user.forgotPassword(req, res, null);
        });
    });
});