# 3.1.0
See readme for more details
* Added masking possibilities
* Added `callerInfo` configuration
* Added `isDebugEnabled` & `isTraceEnabled` methods
* Added benchmarks
* Added more config options via `process.env`

# 3.0.0
* Typescript compatible
* New initialization:
```typescript
import { getLogger } from 'log4njs';
const log = getLogger({ });
```
* The following shorthand methods are no longer supported:
  * warn -- Use `warning` instead
  * err -- Use `error` instead
  * crit -- Use `critical` instead

# 2.2.3
* Added zerofill to milliseconds

# 2.2.2
* Updated dev dependencies

# 2.2.1
* Updated dev dependencies

# 2.2.0
* Added `isDebugEnabled()`

# 2.1.0
* Introduced AUDIT & AUDIT_ALERT log levels.

# 2.0.0
##### Breaking changes
* New initialization:
    * `const log = require('log4njs)(options)`
* Removed functions:
    * options
    * setPrefix
    * setLogLevel
    * getSettings
* Removed log level:
    * fatal
    
##### Bug fixes
With the changes each logger instance is now self contained.
Configuration no longer spills over to other instances of the logger.

# 1.0.2
* Syntax fix

# 1.0.1
* Moved nyc to dev deps

# 1.0.0
* First release
