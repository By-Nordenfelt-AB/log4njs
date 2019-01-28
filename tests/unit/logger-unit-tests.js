const expect = require('chai').expect;
const sinon  = require('sinon');
const util   = require('util');

/* eslint-disable no-console */
describe('Index unit tests', () => {
    let logger;
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
        logger  = require('../../src/index');
    });

    beforeEach(() => {
        sandbox.stub(console, 'log');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('logger', () => {
        it('levels - trace', (done) => {
            testLogLevel('trace', 9, done);
        });
        it('levels - debug', (done) => {
            testLogLevel('debug', 8, done);
        });
        it('levels - info', (done) => {
            testLogLevel('info', 7, done);
        });
        it('levels - warning', (done) => {
            testLogLevel('warning', 6, done);
        });
        it('levels - error', (done) => {
            testLogLevel('error', 4, done);
        });
        it('levels - critical', (done) => {
            testLogLevel('critical', 2, done);
        });
        it('levels - suppress', (done) => {
            testLogLevel('suppress', 0, done);
        });

        function testLogLevel(level, expectedCount, done) {
            const log = logger({ level: level });
            log.trace('trace');
            log.debug('debug');
            log.info('info');
            log.warn('warn');
            log.warning('warning');
            log.err('err');
            log.error('error');
            log.crit('crit');
            log.critical('critical');
            expect(console.log.callCount).to.equal(expectedCount);
            done();
        }

        it('with attachment', (done) => {
            const log        = logger();
            const attachment = { foo: 'bar' };
            log.info('test', attachment);
            expect(console.log.callCount).to.equal(1);
            expect(console.log.firstCall.args[1]).to.equal(util.inspect(attachment));
            done();
        });

        it('with timestamp', (done) => {
            const log = logger({ timestamp: true });
            log.info('test');
            expect(console.log.callCount).to.equal(1);
            expect(console.log.firstCall.args[0]).to.match(/[[INFO]] [-0-9]{10}T[:0-9]{8}.[0-9]{3}Z test/);
            done();
        });

        it('with prefix', (done) => {
            const log = logger({ prefix: 'MyPrefix' });
            log.info('test');
            expect(console.log.callCount).to.equal(1);
            expect(console.log.firstCall.args[0]).to.contain('MyPrefix');
            done();
        });

        it('with invalid log level should default to info', (done) => {
            const log = logger({ level: 'invalid' });
            log.debug('test');
            log.info('test');
            expect(console.log.callCount).to.equal(1);
            done();
        });

        it('with log level via env', (done) => {
            process.env.LOG_LEVEL = 'ERROR';
            const log             = logger();
            log.info('test');
            log.err('test');
            expect(console.log.callCount).to.equal(1);
            done();
        });
    });
});
