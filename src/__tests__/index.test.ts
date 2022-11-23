import { getLogger, LogLevel } from '../index';

jest.spyOn(global.console, 'log').mockImplementation();
jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValue('2022-11-23T13:26:05.098Z');

describe('Logger', () => {
    describe('Get Logger', () => {
        it('should instantiate logger without options', async () => {
            const log = getLogger();
            log.info('My message');

            expect(log.getSettings()).toEqual({
                level: LogLevel.INFO,
                prefix: '',
                timestamp: false,
            });
            expect(console.log).toBeCalledWith('[INFO] My message');
        });
        it('should instantiate logger with options', async () => {
            const log = getLogger({level: LogLevel.WARNING, prefix: 'My Prefix', timestamp: true});
            log.info('My message');
            log.warning('My message');

            expect(log.getSettings()).toEqual({
                level: LogLevel.WARNING,
                prefix: 'My Prefix',
                timestamp: true,
            });
            expect(console.log).toBeCalledTimes(1);
            expect(console.log).toBeCalledWith('[WARNING] 2022-11-23T13:26:05.098Z My PrefixMy message');
        });

        it('should instantiate logger with level from process.env', async () => {
            process.env.LOG_LEVEL = 'DEBUG';
            const log = getLogger();
            log.info('My message');

            expect(log.getSettings()).toEqual({
                level: LogLevel.DEBUG,
                prefix: '',
                timestamp: false,
            });
            expect(console.log).toBeCalledWith('[INFO] My message');
        });
    });

    describe('Log level functions', () => {
        let expectedCount = 8;
        it('level - trace', () => {
            testLogLevel(LogLevel.TRACE);
            expect(console.log).toBeCalledTimes(expectedCount);
        });
        it('levels - debug', () => {
            testLogLevel(LogLevel.DEBUG);
            expect(console.log).toBeCalledTimes(--expectedCount);
        });
        it('levels - info', () => {
            testLogLevel(LogLevel.INFO);
            expect(console.log).toBeCalledTimes(--expectedCount);
        });
        it('levels - warning', () => {
            testLogLevel(LogLevel.WARNING);
            expect(console.log).toBeCalledTimes(--expectedCount);
        });
        it('levels - error', () => {
            testLogLevel(LogLevel.ERROR);
            expect(console.log).toBeCalledTimes(--expectedCount);
        });
        it('levels - critical', () => {
            testLogLevel(LogLevel.CRITICAL);
            expect(console.log).toBeCalledTimes(--expectedCount);
        });
        it('levels - audit', () => {
            testLogLevel(LogLevel.AUDIT);
            expect(console.log).toBeCalledTimes(--expectedCount);
        });
        it('levels - audit_alert', () => {
            testLogLevel(LogLevel.AUDIT_ALERT);
            expect(console.log).toBeCalledTimes(expectedCount);
        });
        it('levels - suppress', () => {
            testLogLevel(LogLevel.SUPPRESS);
            expect(console.log).toBeCalledTimes(0);
        });

        function testLogLevel(level: LogLevel): void {
            const log = getLogger({level});

            log.trace('Foo');
            log.debug('Foo');
            log.info('Foo');
            log.warning('Foo');
            log.error('Foo');
            log.critical('Foo');
            log.audit('Foo');
            log.auditAlert('Foo');
            // expect(console.log.callCount).to.equal(expectedCount);
        }
    });

    describe('Attachments', () => {
        it('should include attachment', async () => {
            const log = getLogger();
            log.info('My message', {foo: 'bar'});

            expect(console.log).toBeCalledWith('[INFO] My message', '{ foo: \'bar\' }');
        });
    });
});
