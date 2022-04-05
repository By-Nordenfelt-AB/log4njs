import { format, inspect } from 'util';

export enum LogLevel {
    TRACE = 100,
    DEBUG = 200,
    INFO = 300,
    WARNING = 400,
    ERROR = 500,
    CRITICAL = 600,
    AUDIT = 980,
    AUDIT_ALERT = 990,
    SUPPRESS = 1000,
}

interface LogSettings {
    logLevel: LogLevel;
    prefix: string;
    timestamp: boolean;
}

interface Logger {
    trace(message: string, attachment?: any): void,

    debug(message: string, attachment?: any): void,

    info(message: string, attachment?: any): void,

    warning(message: string, attachment?: any): void,

    error(message: string, attachment?: any): void,

    critical(message: string, attachment?: any): void,

    audit(message: string, attachment?: any): void,

    auditAlert(message: string, attachment?: any): void,

    isDebugEnabled(): boolean,

    settings: LogSettings
}

export function getLogger(options?: Partial<LogSettings>): Logger {
    const settings: LogSettings = {
        logLevel: _transformLogLevel(options?.logLevel || process.env.LOG_LEVEL || LogLevel.INFO),
        prefix: options?.prefix || '',
        timestamp: options?.timestamp || false,
    };

    return {
        trace: (message: string, attachment: any) => {
            _log(LogLevel.TRACE, message, attachment, settings);
        },
        debug: (message: string, attachment: any) => {
            _log(LogLevel.DEBUG, message, attachment, settings);
        },
        info: (message: string, attachment: any) => {
            _log(LogLevel.INFO, message, attachment, settings);
        },
        warning: (message: string, attachment: any) => {
            _log(LogLevel.WARNING, message, attachment, settings);
        },
        error: (message: string, attachment: any) => {
            _log(LogLevel.ERROR, message, attachment, settings);
        },
        critical: (message: string, attachment: any) => {
            _log(LogLevel.CRITICAL, message, attachment, settings);
        },
        audit: (message: string, attachment: any) => {
            _log(LogLevel.AUDIT, message, attachment, settings);
        },
        auditAlert: (message: string, attachment: any) => {
            _log(LogLevel.AUDIT_ALERT, message, attachment, settings);
        },
        isDebugEnabled: () => {
            return settings.logLevel <= LogLevel.DEBUG;
        },
        settings,
    };
}

function _log(logLevel: LogLevel, message: string, attachment: any, settings: LogSettings): void {
    if (settings.logLevel <= logLevel) {
        let formattedMessage: string;

        if (settings.timestamp) {
            const date = (new Date()).toISOString();
            formattedMessage = format('[%s] %s %s%s', LogLevel[logLevel], date, settings.prefix, message);
        } else {
            formattedMessage = format('[%s] %s%s', LogLevel[logLevel], settings.prefix, message);
        }

        if (attachment) {
            /* eslint-disable-next-line no-console */
            console.log(formattedMessage, inspect(attachment, false, null));
        } else {
            /* eslint-disable-next-line no-console */
            console.log(formattedMessage);
        }
    }
}

function _transformLogLevel(logLevel: string | number): LogLevel {
    const level = parseInt(logLevel.toString());
    if (isNaN(level)) {
        return LogLevel[logLevel.toString().toUpperCase()] || LogLevel.INFO;
    }
    return level;
}
