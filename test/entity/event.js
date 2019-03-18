'use strict';

const sinon = require('sinon');
const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();

let fakeQueries = {
    getEventById: function () {
        return [null, []];
    },
    getAllEvents: function () {
        return [null, []];
    }
};

let fakeExecuteQuery = function (query, cb) {
    return cb(...fakeQueries[query]());
};

let event = proxyquire('../../entity/event.js', {
    '../config/queries': {
        getEventById: 'getEventById',
        getAllEvents: 'getAllEvents'
    },
    '../service/mysql': {
        executeQuery: function(query, params, cb) {
            return fakeExecuteQuery(query, cb);
        }
    }
});

describe('entity.event', function () { /* Es preferible no utilizar arrow functions por el contexto que usa Mocha */
    describe('get', function() {
        let sandbox = sinon.createSandbox();
        let errorGetEventById = false;
        let emptyGetEventById = false;

        beforeEach(function () {
            errorGetEventById = false;
            emptyGetEventById = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'getEventById').callsFake(function () {
                if (errorGetEventById) {
                    return [true];
                }

                if (emptyGetEventById) {
                    return [null, []];
                }

                return [null, [
                    {
                        id: 1,
                        author: 'Autor',
                        duration: 30,
                        director: 'Director',
                        name: 'Nombre',
                        profile_image: 'Perfil',
                        premiere: 'Fecha',
                        distance: 30,
                        national_cachet: 7555,
                        international_cachet: 5845,
                        borderaux: 4574,
                        cover_image: 'Cover',
                        trailer: 'Trailer',
                        cast: 'Actor 1, Actor 2',
                        synthesis: 'Sintesis',
                        city: 'Ciudad',
                        genre: 'Genero',
                        public_type: 1,
                        needed_people: 20,
                        assembly_hours: 2,
                        disassembly_hours: 2,
                        needed_space: '30mx30m',
                        sound: 1,
                        scenography: 1
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
                    expect(resp).to.have.property('author', 'Autor');
                    expect(resp).to.have.property('duration', 30);
                    expect(resp).to.have.property('director', 'Director');
                    expect(resp).to.have.property('name', 'Nombre');
                    expect(resp).to.have.property('profile_image', 'Perfil');
                    expect(resp).to.have.property('premiere', 'Fecha');
                    expect(resp).to.have.property('distance', 30);
                    expect(resp).to.have.property('cachet');
                    expect(resp.cachet).to.have.property('national_cachet', 7555);
                    expect(resp.cachet).to.have.property('international_cachet', 5845);
                    expect(resp.cachet).to.have.property('borderaux', 4574);
                    expect(resp).to.have.property('cover_image', 'Cover');
                    expect(resp).to.have.property('trailer', 'Trailer');
                    expect(resp).to.have.property('cast', 'Actor 1, Actor 2');
                    expect(resp).to.have.property('synthesis', 'Sintesis');
                    expect(resp).to.have.property('city', 'Ciudad');
                    expect(resp).to.have.property('genre', 'Genero');
                    expect(resp).to.have.property('public_type', 1);
                    expect(resp).to.have.property('technicalRequeriments');
                    expect(resp.technicalRequeriments).to.have.property('needed_people', 20);
                    expect(resp.technicalRequeriments).to.have.property('assembly_hours', 2);
                    expect(resp.technicalRequeriments).to.have.property('disassembly_hours', 2);
                    expect(resp.technicalRequeriments).to.have.property('needed_space', '30mx30m');
                    expect(resp.technicalRequeriments).to.have.property('sound', 1);
                    expect(resp.technicalRequeriments).to.have.property('scenography', 1);
                    expect(resp).to.have.property('gallery');
                    expect(resp).to.have.property('requirements');
                    done();
                }
            };

            event.get(req, res, null);
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
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorGetEventById = true;

            event.get(req, res, null);
        });

        it('Can\'t find the event', function (done) {
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
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Can\'t find the event.');
                    done();
                }
            };

            emptyGetEventById = true;

            event.get(req, res, null);
        });
    });

    describe('all', function() {
        let sandbox = sinon.createSandbox();
        let errorGetAllEvents = false;
        
        beforeEach(function () {
            errorGetAllEvents = false;
        });

        before(function () {
            sandbox.stub(fakeQueries, 'getAllEvents').callsFake(function () {
                if (errorGetAllEvents) {
                    return [true];
                }

                return [null, [
                    {
                        id: 1,
                        author: 'Autor',
                        duration: 30,
                        director: 'Director',
                        name: 'Nombre',
                        profile_image: 'Perfil',
                        premiere: 'Fecha',
                        distance: 30,
                        national_cachet: 7555,
                        international_cachet: 5845,
                        borderaux: 4574,
                        cover_image: 'Cover',
                        trailer: 'Trailer',
                        cast: 'Actor 1, Actor 2',
                        synthesis: 'Sintesis',
                        city: 'Ciudad',
                        genre: 'Genero',
                        public_type: 1,
                        needed_people: 20,
                        assembly_hours: 2,
                        disassembly_hours: 2,
                        needed_space: '30mx30m',
                        sound: 1,
                        scenography: 1
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
                    expect(resp).to.be.an('Array');
                    expect(resp[0]).to.exist;
                    expect(resp[0]).to.have.property('id', 1);
                    expect(resp[0]).to.have.property('author', 'Autor');
                    expect(resp[0]).to.have.property('duration', 30);
                    expect(resp[0]).to.have.property('director', 'Director');
                    expect(resp[0]).to.have.property('name', 'Nombre');
                    expect(resp[0]).to.have.property('profile_image', 'Perfil');
                    expect(resp[0]).to.have.property('premiere', 'Fecha');
                    expect(resp[0]).to.have.property('distance', 30);
                    expect(resp[0]).to.have.property('cachet');
                    expect(resp[0].cachet).to.have.property('national_cachet', 7555);
                    expect(resp[0].cachet).to.have.property('international_cachet', 5845);
                    expect(resp[0].cachet).to.have.property('borderaux', 4574);
                    expect(resp[0]).to.have.property('cover_image', 'Cover');
                    expect(resp[0]).to.have.property('trailer', 'Trailer');
                    expect(resp[0]).to.have.property('cast', 'Actor 1, Actor 2');
                    expect(resp[0]).to.have.property('synthesis', 'Sintesis');
                    expect(resp[0]).to.have.property('city', 'Ciudad');
                    expect(resp[0]).to.have.property('genre', 'Genero');
                    expect(resp[0]).to.have.property('public_type', 1);
                    expect(resp[0]).to.have.property('technicalRequeriments');
                    expect(resp[0].technicalRequeriments).to.have.property('needed_people', 20);
                    expect(resp[0].technicalRequeriments).to.have.property('assembly_hours', 2);
                    expect(resp[0].technicalRequeriments).to.have.property('disassembly_hours', 2);
                    expect(resp[0].technicalRequeriments).to.have.property('needed_space', '30mx30m');
                    expect(resp[0].technicalRequeriments).to.have.property('sound', 1);
                    expect(resp[0].technicalRequeriments).to.have.property('scenography', 1);
                    expect(resp[0]).to.have.property('gallery');
                    expect(resp[0]).to.have.property('requirements');
                    done();
                }
            };

            event.all(req, res, null);
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
                send: function (resp) {
                    expect(resp).to.exist;
                    expect(resp).to.be.equal('Database Error.');
                    done();
                }
            };

            errorGetAllEvents = true;

            event.all(req, res, null);
        });
    });
});