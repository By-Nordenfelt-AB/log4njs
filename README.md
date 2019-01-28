# log4njs

log4njs is a very simple log utility for nodejs.

[![Build Status](https://travis-ci.org/carlnordenfelt/log4njs.svg?branch=master)](https://travis-ci.org/carlnordenfelt/log4njs)
[![npm version](https://badge.fury.io/js/log4njs.svg)](https://badge.fury.io/js/log4njs)
[![Coverage Status](https://coveralls.io/repos/github/carlnordenfelt/log4njs/badge.svg?branch=master)](https://coveralls.io/github/carlnordenfelt/log4njs?branch=master)

## Installation
```
npm i log4njs --save
```

### Migration to 2.0.0
See CHANGELOG for breaking changes.

## Default usage
```
$ const log = require('log4njs')();
$ log.info('Hello world', { foo: 'bar' });
> '[INFO] Hello world' { foo: 'bar' }
```

## API

### Options
* **level:** String or int. The log level of the logger instance. Defaults to `INFO (300)`.
* **prefix:** String. An optional string that is prefixed to all log message. Default to `''`.
* **timestamp:** Boolean. Indicate if the log messages should include the current timestamp (YYYY-MM-DDTHH:mm:ss:mmmZ). Default to `false`.

Setting the environment variable `LOG_LEVEL` will initiate the logger with the provided setting.
If log level is not provided it is set to `INFO`.

#### Example
```
const log = require('log4njs')({ level: 'DEBUG', prefix: 'MyPrefix::', timstamp: true });
```

### Suppress logs
In unit tests, for example, you may want to suppress all log statements:
```
$ LOG_LEVEL=suppress npm test
```

### Log levels
Each log level corresponds to a valid configuration value.
```
$ log.trace(message[, attachment]);
> [TRACE] ...

$ log.debug(message[, attachment]);
> [DEBUG] ... 

$ log.info(message[, attachment]);
> [INFO] ...

$ log.warn(message[, attachment]);
$ log.warning(message[, attachment]);
> [WARNING] ...

$ log.error(message[, attachment]);
> [ERROR] ...

$ log.critical(message[, attachment]);
> [CRITICAL] ...
```

#### Shorthand functions
**Note:** The shorthand names are not valid configuration values.
```
$ log.warn(message[, attachment]); // Shorthand for warning

$ log.err(message[, attachment]); // Shorthand for error

$ log.crit(message[, attachment]); // Shorthand for critical
```
