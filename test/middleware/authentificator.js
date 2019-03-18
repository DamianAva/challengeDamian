'use strict';

const sinon = require('sinon');
const { expect } = require('chai');
const redisService = require('../../service/redis');

let authenticator = require('../../middleware/authentificator');

describe('middleware.autenticator', function () { /* Es preferible no utilizar arrow functions por el contexto que usa Mocha */
    describe('auth', function() {
        let sandbox = sinon.createSandbox();
        let errorRedis = false;
        let emptyRedis = false;
        let errorParse = false;

        beforeEach(function () {
            errorRedis = false;
            emptyRedis = false;
            errorParse = false;
        });

        before(function () {
            sandbox.stub(redisService, 'get').callsFake(function (key, cb) {
                if (errorRedis) {
                    return cb(true);
                }

                if (emptyRedis) {
                    return cb(null, null);
                }

                if (errorParse) {
                    return cb(null, `ERROR`);
                }

                return cb(null, `{ "id": 1, "name": "Damian" }`);
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('User authorized', function (done) {
            let req = {
                headers: {
                    authorization: 'Bearer AAAAA'
                }
            };

            let res = {};

            authenticator.auth(req, res, function () {
                expect(req.session).to.exist;
                expect(req.session).to.have.property('id', 1);
                expect(req.session).to.have.property('name', 'Damian');
                done();
            });
        });

        it('User without token', function (done) {
            let req = {
                headers: {
                    authorization: null
                }
            };

            let res = {};

            authenticator.auth(req, res, function () {
                expect(req.session).to.be.null;
                done();
            });
        });

        it('Redis Error', function (done) {
            let req = {
                headers: {
                    authorization: 'Bearer AAAAA'
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

            authenticator.auth(req, res, function () {
                expect.fail('It didn\'t throw the expected error');
            });
        });

        it('Parse Error', function (done) {
            let req = {
                headers: {
                    authorization: 'Bearer AAAAA'
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
                    expect(resp).to.be.equal('Internal Error.');
                    done();
                }
            };

            errorParse = true;

            authenticator.auth(req, res, function () {
                expect.fail('It didn\'t throw the expected error');
            });
        });

        it('Token not found', function (done) {
            let req = {
                headers: {
                    authorization: 'Bearer AAAAA'
                }
            };

            let res = {};

            emptyRedis = true;

            authenticator.auth(req, res, function () {
                expect(req.session).to.be.null;
                done();
            });
        });
    });
});