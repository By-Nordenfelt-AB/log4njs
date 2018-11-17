# log4n

log4n is a very simple log utility for nodejs.

## Installation
```
npm i log4n --save
```

## Usage
```
$ const log = require('log4n');
$ log.info('Hello world', { foo: 'bar' });
> '[INFO] YYYY-MM-DDTHH:mm:ss:mmmZ Hello world' { foo: 'bar' }
```

## API

### Configuration
Setting the environment variable `LOG_4N_LEVEL` will initiate the logger with the provided setting.
If log level is not provided it is set to `info`.

#### Change the log level on the fly
```
$ log.setLogLevel('warn');
$ log.info('Hello'); // suppressed
$ log.setLogLevel('info');
$ log.info('Hello');
> [INFO] Hello
```

#### Add a prefix to all log messages
```
$ log.setPrefix('MyPrefix::');
$ log.info('Hello);
> [INFO] {DateTime} MyPrefix::Hello
```

#### Hide date time
```
$ log.hideDateTime(true);
$ log.info('Hello);
> [INFO] Hello
```

#### All at once
```
$ log.options( {
    logLevel: 'warn',
    prefix: 'MyPrefix::',
    hideDate: true
});
```

#### Chain configuration
It is also possible to chain the configuration when requiring the logger:

```
$ const log = require('log4n').options({ logLevel: 'error' });
```
This is the same as calling:
```
$ const log = require('log4n');
$ log.options({ logLevel: 'error' });
```
which is the same as:
```
$ const log = require('log4n');
$ log.setLogLevel('error);
```

#### Get the current configuration
primarily exposed for the unit tests
```
$ log.getSettings();
> { logLevel: 'info', prefix: '', showDate: true }
```

### Suppress logs
In unit tests, for example, you may want to suppress all log statements:
```
$ LOG_4N_LEVEL=suppress npm test
```

### Logging 
The function names, e.g: `warn` corresponds to valid log level settings.
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

$ log.err(message[, attachment]); // Shorthand for error
$ log.error(message[, attachment]);
> [ERROR] ...

$ log.crit(message[, attachment]); // Shorthand for critical
$ log.critical(message[, attachment]);
> [CRITICAL] ...

$ log.fatal(message[, attachment]);
> [FATAL] ...
```
