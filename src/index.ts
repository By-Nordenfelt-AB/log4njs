import { format, inspect } from 'util';

export enum LogLevel {
    TRACE = 100,
    DEBUG = 200,
    INFO = 300,
    WARNING = 400,
    ERROR = 500,
    CRITICAL = 600,
    AUDIT = 999,
    AUDIT_ALERT = 999,
    SUPPRESS = 1000,
}

type LoggerOptions = {
    level: LogLevel;
    prefix: string;
    timestamp: boolean;
};

/**
 * Returns a new logger instance given the options provided.
 * @param {LoggerOptions} options
 */
export function getLogger(options?: Partial<LoggerOptions>) {
    const defaultSettings: LoggerOptions = {
        level: _resolveLogLevel(options?.level, process.env.LOG_LEVEL as keyof typeof LogLevel),
        prefix: '',
        timestamp: false,
    };

    const settings: LoggerOptions = Object.assign(defaultSettings, options || {});

    return {
        trace: (message: string, attachment?: object): void => {
            _log(LogLevel.TRACE, message, attachment);
        },
        debug: (message: string, attachment?: object): void => {
            _log(LogLevel.DEBUG, message, attachment);
        },
        info: (message: string, attachment?: object): void => {
            _log(LogLevel.INFO, message, attachment);
        },
        warning: (message: string, attachment?: object): void => {
            _log(LogLevel.WARNING, message, attachment);
        },
        error: (message: string, attachment?: object): void => {
            _log(LogLevel.ERROR, message, attachment);
        },
        critical: (message: string, attachment?: object): void => {
            _log(LogLevel.CRITICAL, message, attachment);
        },
        audit: (message: string, attachment?: object): void => {
            _log(LogLevel.AUDIT, message, attachment);
        },
        auditAlert: (message: string, attachment?: object): void => {
            _log(LogLevel.AUDIT_ALERT, message, attachment);
        },
        getSettings: (): LoggerOptions => {
            return settings;
        },
    };

    function _log(logLevel: LogLevel, message: string, attachment?: object): void {
        if (settings.level <= logLevel) {
            let formattedMessage;

            if (settings.timestamp) {
                formattedMessage = format('[%s] %s %s%s', LogLevel[logLevel], new Date().toISOString(), settings.prefix, message);
            } else {
                formattedMessage = format('[%s] %s%s', LogLevel[logLevel], settings.prefix, message);
            }

            /* tslint:disable: no-console */
            if (attachment) {
                console.log(formattedMessage, inspect(attachment, false, null));
            } else {
                console.log(formattedMessage);
            }
            /* tslint:enable: no-console */
        }
    }
}

/**
 * Resolves the log level for the logger instance.
 * Log level is resolved in the following order:
 * 1. Provided logLevel assuming that it is set and valid
 * 2. From process.env.LOG_LEVEL, assuming that it is set and valid
 * 3. Default LogLevel.INFO
 * @param level Optional specific log level
 * @param processLogLevel
 */
function _resolveLogLevel(level?: LogLevel, processLogLevel?: keyof typeof LogLevel): LogLevel {
    if (level && LogLevel[level]) {
        return level;
    } else if (processLogLevel !== undefined && LogLevel[processLogLevel]) {
        return LogLevel[processLogLevel];
    }

    return LogLevel.INFO;
}
