'use strict';

const sinon = require('sinon');
const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();

let fakeQueries = {
    updateTheatre: function () {
        return [null, {}];
    },
    getTheatreAfterUpdate: function () {
        return [null, []];
    },
    getAllTheatre: function () {
        return [null, []];
    },
    getTheatreByUserId: function () {
        return [null, []];
    },
    getTheatreById: function () {
        return [null, []];
    },
    getTheatreRoomById: function () {
        return [null, []];
    }
};

let fakeExecuteQuery = function (query, cb) {
    return cb(...fakeQueries[query]());
};

let theatre = proxyquire('../../entity/theatre/controller.js', {
    './queries': {
        updateTheatre: 'updateTheatre',
        getTheatreAfterUpdate: 'getTheatreAfterUpdate',
        getAllTheatre: 'getAllTheatre',
        getTheatreByUserId: 'getTheatreByUserId',
        getTheatreById: 'getTheatreById',
        getTheatreRoomById: 'getTheatreRoomById'
    },
    '../../service/mysql': {
        executeQuery: function(query, params, cb) {
            return fakeExecuteQuery(query, cb);
        }
    }
});

describe('entity.theatre', function () { /* Es preferible no utilizar arrow functions por el contexto que usa Mocha */
    describe('update', function() {
        let sandbox = sinon.createSandbox();
        let errorUpdateTheatre = false;
        let noAffectedRowsUpdateTheatre = false;
        let errorGetTheatreAfterUpdate = false;
        let emptyGetTheatreAfterUpdate = false;

        beforeEach(function () {
            errorUpdateTheatre = false;
            noAffectedRowsUpdateTheatre = false;
            errorGetTheatreAfterUpdate = false;
            emptyGetTheatreAfterUpdate = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'updateTheatre').callsFake(function () {
                if (errorUpdateTheatre) {
                    return [true];
                }

                if (noAffectedRowsUpdateTheatre) {
                    return [null, { affectedRows: 0 }];
                }

                return [null, { affectedRows: 1 }];
            });

            sandbox.stub(fakeQueries, 'getTheatreAfterUpdate').callsFake(function () {
                if (errorGetTheatreAfterUpdate) {
                    return [true];
                }

                if (emptyGetTheatreAfterUpdate) {
                    return [null, []];
                }

                return [null, [
                    {
                        id: 1,
                        name: 'Teatro',
                        address: 'Direccion',
                        phone: 'Telefono',
                        email: 'email@email.com',
                        site_url: 'URL',
                        history: 'Historia',
                        country: 'Pais',
                        province: 'Provincia',
                        profile_image: 'Perfil',
                        cover_image: 'Cover',
                        city: 'Ciudad',
                        circuit_type: 1,
                        img_id: 1,
                        src: 'URL A',
                        alt: 'Imagen A'
                    },
                    {
                        id: 1,
                        name: 'Teatro',
                        address: 'Direccion',
                        phone: 'Telefono',
                        email: 'email@email.com',
                        site_url: 'URL',
                        history: 'Historia',
                        country: 'Pais',
                        province: 'Provincia',
                        profile_image: 'Perfil',
                        cover_image: 'Cover',
                        city: 'Ciudad',
                        circuit_type: 1,
                        img_id: 2,
                        src: 'URL B',
                        alt: 'Imagen B'
                    }
                ]]
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Normal flow', function (done) {
            let req = {
                body: {
                    name: 'Nombre',
                    address: 'Direccion',
                    site_url: 'URL',
                    phone: 'Telefono',
                    history: 'Historia'
                },
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
                    expect(resp).to.be.an('Object');
                    expect(resp).to.have.property('id', 1);
                    expect(resp).to.have.property('name', 'Teatro');
                    expect(resp).to.have.property('address', 'Direccion');
                    expect(resp).to.have.property('phone', 'Telefono');
                    expect(resp).to.have.property('email', 'email@email.com');
                    expect(resp).to.have.property('site_url', 'URL');
                    expect(resp).to.have.property('history', 'Historia');
                    expect(resp).to.have.property('country', 'Pais');
                    expect(resp).to.have.property('province', 'Provincia');
                    expect(resp).to.have.property('profile_image');
                    expect(resp).to.have.property('cover_image', 'Cover');
                    expect(resp).to.have.property('city', 'Ciudad');
                    expect(resp).to.have.property('circuit_type', 1);
                    expect(resp).to.have.property('gallery');
                    done();
                }
            };

            theatre.update(req, res, null);
        });

        it('Database Error (Update)', function (done) {
            let req = {
                body: {
                    name: 'Nombre',
                    address: 'Direccion',
                    site_url: 'URL',
                    phone: 'Telefono',
                    history: 'Historia'
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
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorUpdateTheatre = true;

            theatre.update(req, res, null);
        });

        it('Can\'t find the theatre.', function (done) {
            let req = {
                body: {
                    name: 'Nombre',
                    address: 'Direccion',
                    site_url: 'URL',
                    phone: 'Telefono',
                    history: 'Historia'
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
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Can\'t find the theatre.');
                    done();
                }
            };

            noAffectedRowsUpdateTheatre = true;

            theatre.update(req, res, null);
        });

        it('Database Error (Get)', function (done) {
            let req = {
                body: {
                    name: 'Nombre',
                    address: 'Direccion',
                    site_url: 'URL',
                    phone: 'Telefono',
                    history: 'Historia'
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
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorGetTheatreAfterUpdate = true;

            theatre.update(req, res, null);
        });

        it('Database Error (No rows on Get)', function (done) {
            let req = {
                body: {
                    name: 'Nombre',
                    address: 'Direccion',
                    site_url: 'URL',
                    phone: 'Telefono',
                    history: 'Historia'
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
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            emptyGetTheatreAfterUpdate = true;

            theatre.update(req, res, null);
        });
    });

    describe('all', function() {
        let sandbox = sinon.createSandbox();
        let errorGetAllTheatre = false;

        beforeEach(function () {
            errorGetAllTheatre = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'getAllTheatre').callsFake(function () {
                if (errorGetAllTheatre) {
                    return [true];
                }

                return [null, [
                    {
                        id: 1,
                        name: 'Teatro',
                        address: 'Direccion',
                        phone: 'Telefono',
                        email: 'email@email.com',
                        site_url: 'URL',
                        history: 'Historia',
                        country: 'Pais',
                        province: 'Provincia',
                        profile_image: 'Perfil',
                        cover_image: 'Cover',
                        city: 'Ciudad',
                        circuit_type: 1,
                        img_id: 1,
                        src: 'URL A',
                        alt: 'Imagen A',
                        room_id: null,
                        room_name: null,
                        capacity: null,
                        black_camera: null,
                        relevant_data: null,
                        profile_image: null,
                        scenic_space: null,
                        escenary_type: null
                    }
                ]];
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Normal flow', function (done) {
            let req = {};
            let res = {
                status: function(status) {
                    return res;
                },
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.an('Array');
                    expect(resp[0]).to.exist;
                    expect(resp[0]).to.have.property('id', 1);
                    expect(resp[0]).to.have.property('name', 'Teatro');
                    expect(resp[0]).to.have.property('address', 'Direccion');
                    expect(resp[0]).to.have.property('phone', 'Telefono');
                    expect(resp[0]).to.have.property('email', 'email@email.com');
                    expect(resp[0]).to.have.property('site_url', 'URL');
                    expect(resp[0]).to.have.property('history', 'Historia');
                    expect(resp[0]).to.have.property('country', 'Pais');
                    expect(resp[0]).to.have.property('province', 'Provincia');
                    expect(resp[0]).to.have.property('profile_image');
                    expect(resp[0]).to.have.property('cover_image', 'Cover');
                    expect(resp[0]).to.have.property('city', 'Ciudad');
                    expect(resp[0]).to.have.property('circuit_type', 1);
                    expect(resp[0]).to.have.property('gallery');
                    expect(resp[0]).to.have.property('rooms');
                    done();
                }
            };

            theatre.all(req, res, null);
        });

        it('Database error', function(done) {
            let req = {};
            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorGetAllTheatre = true;

            theatre.all(req, res, null);
        });
    });

    describe('profile', function() {
        let sandbox = sinon.createSandbox();
        let errorGetTheatreByUserId = false;
        let emptyGetTheatreByUserId = false;

        beforeEach(function () {
            errorGetTheatreByUserId = false;
            emptyGetTheatreByUserId = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'getTheatreByUserId').callsFake(function () {
                if (errorGetTheatreByUserId) {
                    return [true];
                }

                if (emptyGetTheatreByUserId) {
                    return [null, []];
                }

                return [null, [
                    {
                        id: 1,
                        name: 'Teatro',
                        address: 'Direccion',
                        phone: 'Telefono',
                        email: 'email@email.com',
                        site_url: 'URL',
                        history: 'Historia',
                        country: 'Pais',
                        province: 'Provincia',
                        profile_image: 'Perfil',
                        cover_image: 'Cover',
                        city: 'Ciudad',
                        circuit_type: 1,
                        img_id: 1,
                        src: 'URL A',
                        alt: 'Imagen A',
                        room_id: null,
                        room_name: null,
                        capacity: null,
                        black_camera: null,
                        relevant_data: null,
                        profile_image: null,
                        scenic_space: null,
                        escenary_type: null
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
                    expect(resp).to.be.an('Object');
                    expect(resp).to.have.property('id', 1);
                    expect(resp).to.have.property('name', 'Teatro');
                    expect(resp).to.have.property('address', 'Direccion');
                    expect(resp).to.have.property('phone', 'Telefono');
                    expect(resp).to.have.property('email', 'email@email.com');
                    expect(resp).to.have.property('site_url', 'URL');
                    expect(resp).to.have.property('history', 'Historia');
                    expect(resp).to.have.property('country', 'Pais');
                    expect(resp).to.have.property('province', 'Provincia');
                    expect(resp).to.have.property('profile_image');
                    expect(resp).to.have.property('cover_image', 'Cover');
                    expect(resp).to.have.property('city', 'Ciudad');
                    expect(resp).to.have.property('circuit_type', 1);
                    expect(resp).to.have.property('gallery');
                    expect(resp).to.have.property('rooms');
                    done();
                }
            };

            theatre.profile(req, res, null);
        });

        it('Database Error', function (done) {
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
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorGetTheatreByUserId = true;

            theatre.profile(req, res, null);
        });

        it('Can\'t find the theatre', function (done) {
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
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Can\'t find the theatre.');
                    done();
                }
            };

            emptyGetTheatreByUserId = true;

            theatre.profile(req, res, null);
        });
    });

    describe('get', function() {
        let sandbox = sinon.createSandbox();
        let errorGetTheatreById = false;
        let emptyGetTheatreById = false;

        beforeEach(function () {
            errorGetTheatreById = false;
            emptyGetTheatreById = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'getTheatreById').callsFake(function () {
                if (errorGetTheatreById) {
                    return [true];
                }

                if (emptyGetTheatreById) {
                    return [null, []];
                }

                return [null, [
                    {
                        id: 1,
                        name: 'Teatro',
                        address: 'Direccion',
                        phone: 'Telefono',
                        email: 'email@email.com',
                        site_url: 'URL',
                        history: 'Historia',
                        country: 'Pais',
                        province: 'Provincia',
                        profile_image: 'Perfil',
                        cover_image: 'Cover',
                        city: 'Ciudad',
                        circuit_type: 1,
                        img_id: 1,
                        src: 'URL A',
                        alt: 'Imagen A',
                        room_id: null,
                        room_name: null,
                        capacity: null,
                        black_camera: null,
                        relevant_data: null,
                        profile_image: null,
                        scenic_space: null,
                        escenary_type: null
                    }
                ]];
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Normal flow', function (done) {
            let req = {
                params: {
                    id: 1
                }
            };

            let res = {
                status: function(status) {
                    return res;
                },
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.an('Object');
                    expect(resp).to.have.property('id', 1);
                    expect(resp).to.have.property('name', 'Teatro');
                    expect(resp).to.have.property('address', 'Direccion');
                    expect(resp).to.have.property('phone', 'Telefono');
                    expect(resp).to.have.property('email', 'email@email.com');
                    expect(resp).to.have.property('site_url', 'URL');
                    expect(resp).to.have.property('history', 'Historia');
                    expect(resp).to.have.property('country', 'Pais');
                    expect(resp).to.have.property('province', 'Provincia');
                    expect(resp).to.have.property('profile_image');
                    expect(resp).to.have.property('cover_image', 'Cover');
                    expect(resp).to.have.property('city', 'Ciudad');
                    expect(resp).to.have.property('circuit_type', 1);
                    expect(resp).to.have.property('gallery');
                    expect(resp).to.have.property('rooms');
                    done();
                }
            };

            theatre.get(req, res, null);
        });

        it('Database Error', function (done) {
            let req = {
                params: {
                    id: 1
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorGetTheatreById = true;

            theatre.get(req, res, null);
        });

        it('Can\'t find the theatre', function (done) {
            let req = {
                params: {
                    id: 1
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Can\'t find the theatre.');
                    done();
                }
            };

            emptyGetTheatreById = true;

            theatre.get(req, res, null);
        });
    });

    describe('getRoom', function() {
        let sandbox = sinon.createSandbox();
        let errorGetTheatreRoomById = false;
        let emptyGetTheatreRoomById = false;

        beforeEach(function () {
            errorGetTheatreRoomById = false;
            emptyGetTheatreRoomById = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'getTheatreRoomById').callsFake(function () {
                if (errorGetTheatreRoomById) {
                    return [true];
                }

                if (emptyGetTheatreRoomById) {
                    return [null, []];
                }

                return [null, [
                    {
                        id: 1,
                        name: 'Sala',
                        capacity: 100,
                        black_camera: 1,
                        relevant_data: 'Datos relevantes',
                        profile_image: 'Perfil',
                        scenic_space: '30mx30m',
                        escenary_type: 1,
                        theatre_id: 1,
                        theatre_name: 'Teatro',
                        address: 'Direccion',
                        phone: 'Telefono',
                        email: 'email@email.com',
                        site_url: 'URL',
                        history: 'Historia',
                        country: 'Pais',
                        province: 'Provincia',
                        profile_image: 'Perfil',
                        cover_image: 'Cover',
                        city: 'Ciudad',
                        circuit_type: 1,
                        img_id: 1,
                        src: 'URL A',
                        alt: 'Imagen A'
                    }
                ]];
            });
        });

        after(function () {
            sandbox.restore();
        });

        it('Normal flow', function (done) {
            let req = {
                params: {
                    id: 1
                }
            };

            let res = {
                status: function(status) {
                    return res;
                },
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.an('Object');
                    expect(resp).to.have.property('id', 1);
                    expect(resp).to.have.property('name', 'Sala');
                    expect(resp).to.have.property('capacity', 100);
                    expect(resp).to.have.property('black_camera', 1);
                    expect(resp).to.have.property('relevant_data', 'Datos relevantes');
                    expect(resp).to.have.property('profile_image');
                    expect(resp).to.have.property('scenic_space', '30mx30m');
                    expect(resp).to.have.property('escenary_type', 1);
                    expect(resp).to.have.property('theatre');
                    done();
                }
            };

            theatre.getRoom(req, res, null);
        });

        it('Database Error', function (done) {
            let req = {
                params: {
                    id: 1
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorGetTheatreRoomById = true;

            theatre.getRoom(req, res, null);
        });

        it('Can\'t find the Room', function (done) {
            let req = {
                params: {
                    id: 1
                }
            };

            let res = {
                status: function(status) {
                    expect(status).to.exist;
                    expect(status).to.be.equal(500);
                    return res;
                },
                send: function(resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Can\'t find the Room.');
                    done();
                }
            };

            emptyGetTheatreRoomById = true;

            theatre.getRoom(req, res, null);
        });
    });
});