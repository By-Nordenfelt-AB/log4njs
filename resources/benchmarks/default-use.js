const log4njs = require('log4njs');

const enableAttachment = process.argv[2] === 'true';
const iterations = 10000;
const log = log4njs.getLogger();

let attachment = undefined;
if (enableAttachment) {
    attachment = { foo: 'bar' };
}
console.time(`default benchmark: ${enableAttachment}`);
for (let i = 0; i < iterations; i++) {
    log.info('Test', attachment);
}
console.timeEnd(`default benchmark: ${enableAttachment}`);
