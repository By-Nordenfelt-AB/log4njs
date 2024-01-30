const log4njs = require('log4njs');

const enableCheck = process.argv[2] === 'true';
const iterations = 10000;
const log = log4njs.getLogger();

if (enableCheck) {
    console.time(`isDebugEnabled benchmark: ${enableCheck}`);
    for (let i = 0; i < iterations; i++) {
        if (log.isDebugEnabled()) {
            log.debug('Test');
        }
    }
    console.timeEnd(`isDebugEnabled benchmark: ${enableCheck}`);
} else {
    console.time(`isDebugEnabled benchmark: ${enableCheck}`);
    for (let i = 0; i < iterations; i++) {
        log.debug('Test');
    }
    console.timeEnd(`isDebugEnabled benchmark: ${enableCheck}`);
}

