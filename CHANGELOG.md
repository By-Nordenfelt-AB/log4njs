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
With the changes each logger instance is not self contained.
Configuration no longer spills over to other instances of the logger.

# 1.0.2
* Syntax fix

# 1.0.1
* Moved nyc to dev deps

# 1.0.0
* First release
