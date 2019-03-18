'use strict';

const sinon = require('sinon');
const { expect } = require('chai');

let util = require('../../helper/util');

describe('helper.util', function () { /* Es preferible no utilizar arrow functions por el contexto que usa Mocha */
    describe('generateString', function () {
        it('Random string (Default value)', function() {
            let result = util.generateString();

            expect(result).to.exist;
            expect(result).to.be.an('string');
            expect(result).to.have.lengthOf(10);
        });

        it('Random string (Length = 30)', function() {
            let result = util.generateString(30);

            expect(result).to.exist;
            expect(result).to.be.an('string');
            expect(result).to.have.lengthOf(30);
        });
    });

    describe('isString', function () {
        it('Valid String', function() {
            let result = util.isString('String');

            expect(result).to.exist;
            expect(result).to.be.equal(true);
        });

        it('Invalid String (Number)', function() {
            let result = util.isString(12345);

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid String (Object)', function() {
            let result = util.isString({ test: 'test' });

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid String (Null)', function() {
            let result = util.isString(null);

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid String (Undefined)', function() {
            let result = util.isString(undefined);

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });
    });

    describe('isNumber', function () {
        it('Valid Number', function() {
            let result = util.isNumber(12345);

            expect(result).to.exist;
            expect(result).to.be.equal(true);
        });

        it('Invalid Number (String)', function() {
            let result = util.isNumber('test');

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid Number (Object)', function() {
            let result = util.isNumber({ test: 'test' });

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid Number (Null)', function() {
            let result = util.isNumber(null);

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid Number (Undefined)', function() {
            let result = util.isNumber(undefined);

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });
    });

    describe('isInteger', function () {
        it('Valid Integer', function() {
            let result = util.isInteger(12345);

            expect(result).to.exist;
            expect(result).to.be.equal(true);
        });

        it('Invalid Integer (Float)', function() {
            let result = util.isInteger(20.1092);

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid Integer (String)', function() {
            let result = util.isInteger('test');

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid Integer (Object)', function() {
            let result = util.isInteger({ test:'test' });

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid Integer (Null)', function() {
            let result = util.isInteger(null);

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid Integer (Undefined)', function() {
            let result = util.isInteger(undefined);

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });
    });

    describe('isObject', function () {
        it('Valid Object', function() {
            let result = util.isObject({ test: 'test' });

            expect(result).to.exist;
            expect(result).to.be.equal(true);
        });

        it('Invalid Object (Number)', function() {
            let result = util.isObject(12345);

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid Object (String)', function() {
            let result = util.isObject('test');

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid Object (Null)', function() {
            let result = util.isObject(null);

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });

        it('Invalid Object (Undefined)', function() {
            let result = util.isObject(undefined);

            expect(result).to.exist;
            expect(result).to.be.equal(false);
        });
    });
});