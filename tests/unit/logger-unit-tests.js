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
        let expectedCount = 11;
        it('levels - trace', (done) => {
            testLogLevel('trace', expectedCount, done);
        });
        it('levels - debug', (done) => {
            testLogLevel('debug', --expectedCount, done);
        });
        it('levels - info', (done) => {
            testLogLevel('info', --expectedCount, done);
        });
        it('levels - warning', (done) => {
            testLogLevel('warning', --expectedCount, done);
        });
        it('levels - error', (done) => {
            testLogLevel('error', expectedCount = expectedCount - 2, done);
        });
        it('levels - critical', (done) => {
            testLogLevel('critical', expectedCount = expectedCount - 2, done);
        });
        it('levels - audit', (done) => {
            testLogLevel('audit', expectedCount = expectedCount - 2, done);
        });
        it('levels - audit_alert', (done) => {
            testLogLevel('audit_alert', expectedCount, done);
        });
        it('levels - suppress', (done) => {
            testLogLevel('suppress', expectedCount = expectedCount - 2, done);
        });

        function testLogLevel(level, expectedCount, done) {
            const log = logger({ level: level });
            Object.keys(log).forEach(key => {
                if (typeof log[key] === 'function') {
                    log[key]('logging');
                }
            });
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
            expect(console.log.firstCall.args[0]).to.match(/\[INFO\] [-0-9]{10}T[:0-9]{8}.[0-9]{1,3}Z test/);
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
