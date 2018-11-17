const util = require('util');

const pub = {};

const LOG_LEVEL_TRACE    = 100;
const LOG_LEVEL_DEBUG    = 200;
const LOG_LEVEL_INFO     = 300;
const LOG_LEVEL_WARNING  = 400;
const LOG_LEVEL_ERROR    = 500;
const LOG_LEVEL_CRITICAL = 600;
const LOG_LEVEL_FATAL    = 700;
const LOG_LEVEL_SUPPRESS    = 800;

const LOG_LEVEL_CONVERSION = {
    trace: LOG_LEVEL_TRACE,
    debug: LOG_LEVEL_DEBUG,
    info: LOG_LEVEL_INFO,
    warn: LOG_LEVEL_WARNING,
    warning: LOG_LEVEL_WARNING,
    err: LOG_LEVEL_ERROR,
    error: LOG_LEVEL_ERROR,
    crit: LOG_LEVEL_CRITICAL,
    critical: LOG_LEVEL_CRITICAL,
    fatal: LOG_LEVEL_FATAL,
    suppress: LOG_LEVEL_SUPPRESS
};


const settings = {
    logLevel: LOG_LEVEL_INFO,
    hideDate: false,
    prefix: ''
};

/* istanbul ignore next */
if (process.env.LOG_4NJS_LEVEL && LOG_LEVEL_CONVERSION[process.env.LOG_4NJS_LEVEL.toLowerCase()]) {
    settings.logLevel = LOG_LEVEL_CONVERSION[process.env.LOG_4NJS_LEVEL.toLowerCase()];
}

pub.trace = (message, attachment) => {
    if (settings.logLevel <= LOG_LEVEL_TRACE) {
        log('TRACE', message, attachment);
    }
};

pub.debug = (message, attachment) => {
    if (settings.logLevel <= LOG_LEVEL_DEBUG) {
        log('DEBUG', message, attachment);
    }
};

pub.info = (message, attachment) => {
    if (settings.logLevel <= LOG_LEVEL_INFO) {
        log('INFO', message, attachment);
    }
};

pub.warn = (message, attachment) => {
    pub.warning(message, attachment);
};

pub.warning = (message, attachment) => {
    if (settings.logLevel <= LOG_LEVEL_WARNING) {
        log('WARNING', message, attachment);
    }
};

pub.err = (message, attachment) => {
    pub.error(message, attachment);
};

pub.error = (message, attachment) => {
    if (settings.logLevel <= LOG_LEVEL_ERROR) {
        log('ERROR', message, attachment);
    }
};

pub.crit = (message, attachment) => {
    pub.critical(message, attachment);
};

pub.critical = (message, attachment) => {
    if (settings.logLevel <= LOG_LEVEL_CRITICAL) {
        log('CRITICAL', message, attachment);
    }
};

pub.fatal = (message, attachment) => {
    if (settings.logLevel <= LOG_LEVEL_FATAL) {
        log('FATAL', message, attachment);
    }
};

pub.options = (options) => {
    options = options || {};

    if (options.logLevel && LOG_LEVEL_CONVERSION[options.logLevel]) {
        options.logLevel = options.logLevel.toLowerCase();
        settings.logLevel = LOG_LEVEL_CONVERSION[options.logLevel];
    }

    if (options.prefix) {
        settings.prefix = options.prefix;
    }

    if (options.hideDate !== undefined) {
        settings.hideDate = options.hideDate;
    }

    return pub;
};

pub.setPrefix = (prefix) => {
    settings.prefix = prefix;
};

pub.setLogLevel = (logLevel) => {
    logLevel = logLevel.toLowerCase();
    if (LOG_LEVEL_CONVERSION[logLevel]) {
        settings.logLevel = LOG_LEVEL_CONVERSION[logLevel];
    }
};

pub.getSettings = () => {
    return settings;
};

module.exports = pub;

/* eslint-disable no-console */
function log(logLevel, message, attachment) {
    let formattedMessage;

    if (!settings.hideDate) {
        const now        = new Date();
        const date       = util.format(
            '%s-%s-%sT%s:%s:%s.%sZ',
            now.getUTCFullYear(),
            zf(now.getUTCMonth() + 1),
            zf(now.getUTCDate()),
            zf(now.getUTCHours()),
            zf(now.getUTCMinutes()),
            zf(now.getUTCSeconds()),
            zf(now.getUTCMilliseconds()),
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

function zf(value) {
    /* istanbul ignore next */
    return value < 10 ? '0' + value : value;
}
