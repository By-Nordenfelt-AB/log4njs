const log4njs = require('log4njs');

const enableCallerInfo = process.argv[2] === 'true';
const iterations = 10000;
const log = log4njs.getLogger({ callerInfo: enableCallerInfo });

console.time(`CallerInfo benchmark: ${enableCallerInfo}`);
for (let i = 0; i < iterations; i++) {
    log.info('Test');
}
console.timeEnd(`CallerInfo benchmark: ${enableCallerInfo}`);
