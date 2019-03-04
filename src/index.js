const util = require('util');

const logLevels = {
    TRACE: 100,
    DEBUG: 200,
    INFO: 300,
    WARNING: 400,
    ERROR: 500,
    CRITICAL: 600,
    AUDIT: 999,
    AUDIT_ALERT: 999,
    SUPPRESS: 1000
};

module.exports = (options) => {
    const defaultSettings = {
        level: process.env.LOG_LEVEL || logLevels.INFO,
        prefix: '',
        timestamp: false
    };

    const settings = Object.assign(defaultSettings, options || {});
    // Translate a textual log level to numeric
    if (isNaN(settings.level)) {
        settings.level = logLevels[settings.level.toUpperCase()] ? logLevels[settings.level.toUpperCase()] : logLevels.INFO;
    }

    return {
        trace: (message, attachment) => {
            log('TRACE', message, attachment);
        },
        debug: (message, attachment) => {
            log('DEBUG', message, attachment);
        },
        info: (message, attachment) => {
            log('INFO', message, attachment);
        },
        warn: (message, attachment) => {
            log('WARNING', message, attachment);
        },
        warning: (message, attachment) => {
            log('WARNING', message, attachment);
        },
        err: (message, attachment) => {
            log('ERROR', message, attachment);
        },
        error: (message, attachment) => {
            log('ERROR', message, attachment);
        },
        crit: (message, attachment) => {
            log('CRITICAL', message, attachment);
        },
        critical: (message, attachment) => {
            log('CRITICAL', message, attachment);
        },
        audit: (message, attachment) => {
            log('AUDIT', message, attachment);
        },
        auditAlert: (message, attachment) => {
            log('AUDIT_ALERT', message, attachment);
        },
        isDebugEnabled: () => {
            return settings.level <= logLevels.DEBUG;
        },
        settings: settings
    };

    /* eslint-disable no-console */
    function log(logLevel, message, attachment) {
        if (settings.level <= logLevels[logLevel.toUpperCase()]) {
            let formattedMessage;

            if (settings.timestamp) {
                const now        = new Date();
                const date       = util.format(
                    '%s-%s-%sT%s:%s:%s.%sZ',
                    now.getUTCFullYear(),
                    zf(now.getUTCMonth() + 1),
                    zf(now.getUTCDate()),
                    zf(now.getUTCHours()),
                    zf(now.getUTCMinutes()),
                    zf(now.getUTCSeconds()),
                    zf(now.getUTCMilliseconds())
                );
                formattedMessage = util.format('[%s] %s %s%s', logLevel, date, settings.prefix, message);
            } else {
                formattedMessage = util.format('[%s] %s%s', logLevel, settings.prefix, message);
            }

            if (attachment) {
                console.log(formattedMessage, util.inspect(attachment, false, null));
            } else {
                console.log(formattedMessage);
            }
        }
    }

    function zf(value) {
        /* istanbul ignore next */
        return value < 10 ? '0' + value : value;
    }
};
