'use strict';

const sinon = require('sinon');
const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();

let fakeQueries = {
    getNotificationByUserId: function () {
        return [null, {}];
    },
    updateNotification: function () {
        return [null, {}];
    }
};

let fakeExecuteQuery = function (query, cb) {
    return cb(...fakeQueries[query]());
};

let notification = proxyquire('../../entity/notification.js', {
    '../config/queries': {
        getNotificationByUserId: 'getNotificationByUserId',
        updateNotification: 'updateNotification'
    },
    '../service/mysql': {
        executeQuery: function(query, params, cb) {
            return fakeExecuteQuery(query, cb);
        }
    }
});

describe('entity.notification', function () { /* Es preferible no utilizar arrow functions por el contexto que usa Mocha */
    describe('update', function() {
        let sandbox = sinon.createSandbox();
        let errorUpdateNotification = false;

        beforeEach(function () {
            errorUpdateNotification = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'updateNotification').callsFake(function () {
                if (errorUpdateNotification) {
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
                    type: 1,
                    idDetail: 1
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

            notification.update(req, res, null);
        });

        it('Database Error', function (done) {
            let req = {
                body: {
                    type: 1,
                    idDetail: 1
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

            errorUpdateNotification = true;

            notification.update(req, res, null);
        });
    });

    describe('all', function() {
        let sandbox = sinon.createSandbox();
        let errorGetNotificationByUserId = false;

        beforeEach(function () {
            errorGetNotificationByUserId = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'getNotificationByUserId').callsFake(function () {
                if (errorGetNotificationByUserId) {
                    return [true];
                }

                return [null, [
                    {
                        id: 1,
                        type: 1,
                        text: 'Texto',
                        read: 0,
                        date: 'Fecha'
                    }
                ]];
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Normal flow', function (done) {
            let req = {
                session: {
                    id: 1
                }
            };

            let res = {
                status: function(status) {
                    return res;
                },
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.an('Array');
                    expect(resp[0]).to.exist;
                    expect(resp[0]).to.have.property('id', 1);
                    expect(resp[0]).to.have.property('type', 1);
                    expect(resp[0]).to.have.property('text', 'Texto');
                    expect(resp[0]).to.have.property('read', 0);
                    expect(resp[0]).to.have.property('date', 'Fecha');
                    done();
                }
            };

            notification.all(req, res, null);
        });

        it('Normal flow', function (done) {
            let req = {
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

            errorGetNotificationByUserId = true;

            notification.all(req, res, null);
        });
    });
});