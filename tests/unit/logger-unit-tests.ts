import { describe } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { inspect } from 'util';
import { getLogger, LogLevel } from '../../src';

/* eslint-disable no-console */
describe('Index unit tests', () => {
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        sandbox.stub(console, 'log');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('logger', () => {
        let expectedCount = 8;
        it('levels - trace', (done) => {
            testLogLevel(LogLevel.TRACE, expectedCount, done);
        });
        it('levels - debug', (done) => {
            testLogLevel(LogLevel.DEBUG, --expectedCount, done);
        });
        it('levels - info', (done) => {
            testLogLevel(LogLevel.INFO, --expectedCount, done);
        });
        it('levels - warning', (done) => {
            testLogLevel(LogLevel.WARNING, --expectedCount, done);
        });
        it('levels - error', (done) => {
            testLogLevel(LogLevel.ERROR, --expectedCount, done);
        });
        it('levels - critical', (done) => {
            testLogLevel(LogLevel.CRITICAL, --expectedCount, done);
        });
        it('levels - audit', (done) => {
            testLogLevel(LogLevel.AUDIT, --expectedCount, done);
        });
        it('levels - audit_alert', (done) => {
            testLogLevel(LogLevel.AUDIT_ALERT, --expectedCount, done);
        });
        it('levels - suppress', (done) => {
            testLogLevel(LogLevel.SUPPRESS, --expectedCount, done);
        });

        function testLogLevel(level, expectedCount, done) {
            const log = getLogger({logLevel: level});
            Object.keys(log).forEach(key => {
                if (typeof log[key] === 'function') {
                    log[key]('logging');
                }
            });
            expect(console.log.callCount).to.equal(expectedCount);
            done();
        }

        it('with attachment', (done) => {
            const log = getLogger();
            const attachment = {foo: 'bar'};
            log.info('test', attachment);
            expect(console.log.callCount).to.equal(1);
            expect(console.log.firstCall.args[1]).to.equal(inspect(attachment));
            done();
        });

        it('with timestamp', (done) => {
            const log = getLogger({timestamp: true});
            log.info('test');
            expect(console.log.callCount).to.equal(1);
            expect(console.log.firstCall.args[0]).to.match(/\[INFO] [-0-9]{10}T[:0-9]{8}.[0-9]{3}Z test/);
            done();
        });

        it('with prefix', (done) => {
            const log = getLogger({prefix: 'MyPrefix'});
            log.info('test');
            expect(console.log.callCount).to.equal(1);
            expect(console.log.firstCall.args[0]).to.contain('MyPrefix');
            done();
        });

        it('with log level via env', (done) => {
            process.env.LOG_LEVEL = 'ERROR';
            const log = getLogger();
            expect(log.settings.logLevel).equals(LogLevel.ERROR);
            done();
        });

        it('with log level via env - should default to INFO', (done) => {
            process.env.LOG_LEVEL = 'FOO';
            const log = getLogger();
            expect(log.settings.logLevel).equals(LogLevel.INFO);
            done();
        });

        it('isDebugEnabled - Enabled', (done) => {
            process.env.LOG_LEVEL = 'DEBUG';
            const log = getLogger();
            expect(log.settings.logLevel).equals(LogLevel.DEBUG);
            expect(log.isDebugEnabled()).to.equal(true);
            done();
        });
        it('isDebugEnabled - Disabled', (done) => {
            process.env.LOG_LEVEL = 'INFO';
            const log = getLogger();
            expect(log.isDebugEnabled()).to.equal(false);
            done();
        });
    });
});
