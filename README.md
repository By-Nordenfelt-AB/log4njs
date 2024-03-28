# log4njs

log4njs is a very simple log utility for nodejs & typescript.

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

### Settings
* **level:** enum `LogLevel`. The log level of the logger instance. Defaults to `INFO (300)`.
* **prefix:** String. An optional string that is prefixed to all log messages. Note that no spacing is not automatically added and must be included in the prefix string if required. Default to `''`.
* **timestamp:** Boolean. Indicate if the log messages should include the current timestamp (YYYY-MM-DDTHH:mm:ss:mmmZ). Defaults to `false`.
* **callerInfo:** Boolean. Best effort attempt at including caller filename & line number. Default to `false`.
* **hideLogLevel:** Boolean. Will not output the log level as part of the message if set to true. Default to `false`.

**Example**
```
import { getLogger, LogLevel } from 'log4njs';
const log = getLogger({ level: LogLevel.DEBUG, prefix: 'MyPrefix::', timstamp: true });
```

#### Using environment variables:
* **level**: `LOG_LEVEL=ERROR`
* **prefix**: `LOG_PREFIX=MyPrefix::`
* **timestamp**: `LOG_TIMESTAMP=true`
* **callerInfo**: `LOG_CALLERINFO=true`
* **hideLogLevel**: `LOG_HIDE_LOG_LEVEL=true`

#### Modify settings runtime
Settings can be modified after the logger has been created:
```
const log = getLogger({ timstamp: true });
log.info('Foo');
log.getSettings().timestamp = false;
log.info('Bar');
log.getSettings().timestamp = true;
log.info('Baz');

> [INFO] 2024-01-14T13:35:08.683Z Foo
> [INFO] Bar
> [INFO] 2024-01-14T13:35:40.637Z Baz
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
### Masking data
To ensure that certain values are not printed to the log you can mask data.<br>
**Note:** It is important to clear the masks after you are done, or it may cause a memory leak over time.<br>
**Note:** Masks are case-sensitive. The exact string provided will be masked, nothing else.
```
let password = 'abc123';
try {
    log.addMask(password, 'placeholder');
    log.info('My masked log', { password });
    > '[INFO] Hello world' { password: '***' }
} finally {
    log.clearMasks();
    log.info('My masked log', { password });
    > '[INFO] Hello world' { password: 'abc123' }
}
```

You can optionally set a custom placeholder
```
let password = 'abc123';
log.addMask(password, 'placeholder');
log.info('My masked log', { password }
> '[INFO] Hello world' { password: 'placeholder' }
```

### Benchmarks
There is a couple of sample scripts provided to highlight the performance impact of various configurations.<br>
All benchmarks run 10000 iterations.

Before running the benchmarks, run:
```
cd resources/benchmarks
npm i
```

#### Default usage
Default logging with or without a simple attachment:

Sample, with attachment enabled:
```
node default-use.js true
> default benchmark: true: 141.929ms
```

Sample, with check disabled:
```
node default-use.js
> default benchmark: false: 133.035ms
```

#### isDebugEnabled
Debug logging is usually disabled in production.<br>
Log4njs provides the option to do a pre-check when debug logging to increase performance when debug logging is turned off.<br>
Note that this does take a slight performance hit when debug logging is turned on.

Sample, with check enabled:
```
node check-debug.js true
> isDebugEnabled benchmark: true: 0.604ms
```

Sample, with check disabled:
```
node check-debug.js
> isDebugEnabled benchmark: false: 0.91ms
```

#### callerInfo
The callerInfo setting will attempt to extract the filename & line number of the caller.<br>
This provides useful information when it is difficult to find a specific logger call but takes a slight performance hit.

Sample, with callerInfo enabled:
```
node resources/benchmarks/caller-info.js true
> CallerInfo benchmark: true: 627.254ms
```

Sample, with callerInfo disabled (equivalent to default use with no attachment):
```
node resources/benchmarks/caller-info.js
CallerInfo benchmark: false: 140.666ms
```