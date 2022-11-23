# log4njs

log4njs is a very simple log utility for nodejs.

[![npm version](https://badge.fury.io/js/log4njs.svg)](https://badge.fury.io/js/log4njs)
![Build Status](https://github.com/By-Nordenfelt-AB/log4njs/actions/workflows/main.yml/badge.svg)


## Installation
```
npm i log4njs --save
```

### Migration to 3.0.0
See CHANGELOG for breaking changes.

## Default usage
```
import { getLogger } from 'log4njs';
const log = getLogger();
$ log.info('Hello world', { foo: 'bar' });
> '[INFO] Hello world' { foo: 'bar' }
```

## API

### Options
* **level:** enum `LogLevel`. The log level of the logger instance. Defaults to `INFO (300)`.
* **prefix:** String. An optional string that is prefixed to all log messages. Default to `''`.
* **timestamp:** Boolean. Indicate if the log messages should include the current timestamp (YYYY-MM-DDTHH:mm:ss:mmmZ). Defaults to `false`.

Setting the environment variable `LOG_LEVEL` will initiate the logger with the provided setting.
If log level is not provided it is set to `INFO`.

#### Example
```
import { getLogger, LogLevel } from 'log4njs';
const log = getLogger({ level: LogLevel.DEBUG, prefix: 'MyPrefix::', timstamp: true });
```

### Suppress logs
In unit tests, for example, you may want to suppress all log statements:
```
$ LOG_LEVEL=suppress npm test
```

### Audit Logging
There are two Audit log level, introduced in 2.1.0.: `AUDIT` & `AUDIT_ALERT`.
They can only be turned off by suppressing all logs.

Audit logging is typically sensitive and important but monitored separate from error logs
which is why these two new log levels were introduced.

### Log levels
Each log level corresponds to a valid configuration value.
```
$ log.trace(message[, attachment]);
> [TRACE] ...

$ log.debug(message[, attachment]);
> [DEBUG] ... 

$ log.info(message[, attachment]);
> [INFO] ...

$ log.warning(message[, attachment]);
> [WARNING] ...

$ log.error(message[, attachment]);
> [ERROR] ...

$ log.critical(message[, attachment]);
> [CRITICAL] ...

$ log.audit(message[, attachment]);
> [AUDIT] ...

$ log.auditAlert(message[, attachment]);
> [AUDIT_ALERT] ...
```
