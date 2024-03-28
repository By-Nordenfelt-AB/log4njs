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
    callerInfo: boolean;
    hideLogLevel: boolean;
};

/**
 * Returns a new logger instance given the options provided.
 * @param {LoggerOptions} options
 */
export function getLogger(options?: Partial<LoggerOptions>) {
    const defaultSettings: LoggerOptions = {
        level: _resolveLogLevel(options?.level, process.env.LOG_LEVEL as keyof typeof LogLevel),
        prefix: process.env.LOG_PREFIX ?? '',
        timestamp: process.env.LOG_TIMESTAMP === 'true' || false,
        callerInfo: process.env.LOG_CALLERINFO === 'true' || false,
        hideLogLevel: process.env.LOG_HIDE_LOG_LEVEL === 'true' || false,
    };

    const settings: LoggerOptions = Object.assign(defaultSettings, options || {});

    const masks = new Map();
    let hasMasks = false;

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
        isDebugEnabled: (): boolean => {
            return settings.level <= LogLevel.DEBUG;
        },
        isTraceEnabled: (): boolean => {
            return settings.level <= LogLevel.TRACE;
        },
        addMask(value: string, placeholder = '***'): void {
            masks.set(value, placeholder);
            hasMasks = true;
        },
        removeMask(value: string): void {
            masks.delete(value);
            hasMasks = masks.size > 0;
        },
        clearMasks(): void {
            masks.clear();
            hasMasks = false;
        },
    };

    function _log(logLevel: LogLevel, message: string, attachment?: Record<string, any>): void {
        if (settings.level <= logLevel) {
            const logVariables: any = [];
            let logFormat = '';
            if (!settings.hideLogLevel) {
                logFormat = '[%s] '
                logVariables.push(LogLevel[logLevel]);
            }
            if (settings.timestamp) {
                logFormat += '%s '
                logVariables.push(new Date().toISOString());
            }
            if (settings.prefix) {
                logFormat += '%s'
                logVariables.push(settings.prefix);
            }
            logFormat += '%s';
            logVariables.push(message);


            let formattedMessage = format(logFormat, ...logVariables);
            if (settings.callerInfo) {
                attachment = _attachCallerInfo(attachment);
            }
            if (hasMasks) {
                formattedMessage = _mask(formattedMessage);
            }

            /* tslint:disable: no-console */
            if (attachment) {
                let stringAttachment = inspect(attachment, false, null);
                if (hasMasks) {
                    stringAttachment = _mask(stringAttachment);
                }
                console.log(formattedMessage, stringAttachment);
            } else {
                console.log(formattedMessage);
            }
            /* tslint:enable: no-console */
        }

        function _mask(input: string): string {
            for (const [maskValue, maskPlaceholder] of masks.entries()) {
                input = input.replaceAll(maskValue, maskPlaceholder);
            }
            return input;
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

/* istanbul ignore next */
function _attachCallerInfo(attachment?: Record<string, any>): Record<string, any> {
    if (attachment == null) {
        attachment = {};
    }
    const callerStackLine = new Error().stack?.split('\n')[4];
    if (callerStackLine) {
        const pattern = /\((.*):(\d+):(\d+)\)$/; // This regex pattern matches the file path, line number, and column number
        const match = pattern.exec(callerStackLine);

        if (match) {
            attachment.callerInfo = {
                file: match[1],
                line: match[2],
            };
        }
    }
    return attachment;
}
