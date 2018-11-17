const expect = require('chai').expect;
const sinon  = require('sinon');
const util   = require('util');

/* eslint-disable no-console */
describe('Index unit tests', () => {
    let log;
    let sandbox;

    before(() => {
        log = require('../../src/index');

        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        sandbox.stub(console, 'log');
        log.options({ logLevel: 'info', prefix: '', hideDate: false });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('logger', () => {
        it('levels - trace', (done) => {
            testLogLevel('trace', 10, done);
        });
        it('levels - debug', (done) => {
            testLogLevel('debug', 9, done);
        });
        it('levels - info', (done) => {
            testLogLevel('info', 8, done);
        });
        it('levels - warn', (done) => {
            testLogLevel('warn', 7, done);
        });
        it('levels - warning', (done) => {
            testLogLevel('warning', 7, done);
        });
        it('levels - err', (done) => {
            testLogLevel('err', 5, done);
        });
        it('levels - error', (done) => {
            testLogLevel('error', 5, done);
        });
        it('levels - crit', (done) => {
            testLogLevel('crit', 3, done);
        });
        it('levels - critical', (done) => {
            testLogLevel('critical', 3, done);
        });
        it('levels - fatal', (done) => {
            testLogLevel('fatal', 1, done);
        });
        it('levels - quiet', (done) => {
            testLogLevel('quiet', 0, done);
        });

        function testLogLevel(level, expectedCount, done) {
            log.setLogLevel(level);
            log.trace('trace');
            log.debug('debug');
            log.info('info');
            log.warn('warn');
            log.warning('warning');
            log.err('err');
            log.error('error');
            log.crit('crit');
            log.critical('critical');
            log.fatal('fatal');
            expect(console.log.callCount).to.equal(expectedCount);
            done();
        }

        it('with attachment', (done) => {
            const attachment = { foo: 'bar' };
            log.info('test', attachment);
            expect(console.log.callCount).to.equal(1);
            expect(console.log.firstCall.args[1]).to.equal(util.inspect(attachment));
            done();
        });

        it('set options', (done) => {
            let settings = log.getSettings();
            expect(settings.logLevel).to.equal(300);
            expect(settings.prefix).to.equal('');
            expect(settings.hideDate).to.equal(false);

            log.options({ logLevel: 'warn', prefix: 'Prefix::', hideDate: true });
            settings = log.getSettings();
            expect(settings.logLevel).to.equal(400);
            expect(settings.prefix).to.equal('Prefix::');
            expect(settings.hideDate).to.equal(true);

            // Should not change anything
            log.options();
            settings = log.getSettings();
            expect(settings.logLevel).to.equal(400);
            expect(settings.prefix).to.equal('Prefix::');
            expect(settings.hideDate).to.equal(true);

            // Should not change if level is incorrect
            log.options({ logLevel: 'incorrect' });
            settings = log.getSettings();
            expect(settings.logLevel).to.equal(400);

            log.error('message');
            expect(console.log.firstCall.args[0]).to.equal('[ERROR] Prefix::message');
            done();
        });

        it('set prefix', (done) => {
            log.setPrefix('Prefix::');
            log.error('message');
            expect(console.log.firstCall.args[0]).to.match(
                /\[ERROR\] [0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{1,3}Z Prefix::message/
            );
            done();
        });

        it('set invalid log level should not change level', (done) => {
            log.setLogLevel('invalid');
            expect(log.getSettings().logLevel).to.equal(300);
            done();
        });
    });
});
