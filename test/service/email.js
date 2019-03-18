'use strict';

const sinon = require('sinon');
const { expect } = require('chai');
const nodemailer = require('nodemailer');

let email = require('../../service/email');

describe('service.email', function () { /* Es preferible no utilizar arrow functions por el contexto que usa Mocha */
    describe('send', function() {
        let sandbox = sinon.createSandbox();
        let errorSendMail = false;

        beforeEach(function () {
            errorSendMail = false;
        });

        before(function () {
            sandbox.stub(nodemailer, 'createTransport').callsFake(function () {
                if (errorSendMail) {
                    return {
                        sendMail: function (mailOptions, cb) {
                            return cb(true, null, null);
                        }
                    };
                }

                return {
                    sendMail: function (mailOptions, cb) {
                        return cb(null, { info: 'info' }, null);
                    }
                }
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Email sended', function (done) {
            let params = {
                from: 'from@from.com',
                to: 'to@to.com',
                subject: 'Asunto'
            };

            let content = 'Contenido';

            email.send(params, content, function (err, info, resp) {
                expect(err).to.be.null;
                expect(info).to.exist;
                expect(info).to.have.property('info');
                done();
            });
        });

        it('Missing data (from)', function (done) {
            let params = {
                to: 'to@to.com',
                subject: 'Asunto'
            };

            let content = 'Contenido';

            email.send(params, content, function (err, info, resp) {
                expect(err).to.exist;
                expect(err).to.have.property('err', 'Missing data.');
                done();
            });
        });

        it('Missing data (to)', function (done) {
            let params = {
                from: 'from@from.com',
                subject: 'Asunto'
            };

            let content = 'Contenido';

            email.send(params, content, function (err, info, resp) {
                expect(err).to.exist;
                expect(err).to.have.property('err', 'Missing data.');
                done();
            });
        });

        it('Missing data (subject)', function (done) {
            let params = {
                from: 'from@from.com',
                to: 'to@to.com'
            };

            let content = 'Contenido';

            email.send(params, content, function (err, info, resp) {
                expect(err).to.exist;
                expect(err).to.have.property('err', 'Missing data.');
                done();
            });
        });

        it('Missing data (content)', function (done) {
            let params = {
                from: 'from@from.com',
                to: 'to@to.com',
                subject: 'Asunto'
            };

            let content = null;

            email.send(params, content, function (err, info, resp) {
                expect(err).to.exist;
                expect(err).to.have.property('err', 'Missing data.');
                done();
            });
        });
    });
});