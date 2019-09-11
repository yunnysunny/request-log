# v0.8.0
## Add
1. Add the parameter of `customHeaderKeys` , which indicate the specific headers to store into mongo and kafka.

# v0.7.0
## Add
1. Add the key of `req_time_string`, formated in [ISO 8601 Extended Format](https://en.wikipedia.org/wiki/ISO_8601).
## Improved
1. Bump node-slogger to 2.0.0 .

# v0.6.0
## Fix 
1. Fix the value of `host`, see the issue [#1](https://github.com/yunnysunny/request-log/issues/1).
## Add
1. Add the key of `hostname` to indicate the domain of current server.

# v0.5.2
## Fix 
1. Fix the lack of the right semicolon of user agent string.

# v0.5.1
## Improved
1. Remove unnecessary message of alarm.

# v0.5.0
## Add
1. Don't send alarm message when status code is greater than 600.

# v0.4.0
## Fix
1. In some condition, the event of `finish` will not trigger, so I overwrite the `end` function of `res` to fix it.

# v0.3.0
## Add
1. Add the field `res-code` .

# v0.2.0
## Add
1. Saving request logging to mongodb.
2. Add the filed `req_id`.

# v0.1.1
## Fix
1. Fixed the issue of broken when not given the default parameter.

# v0.1.0
## Fix
1. Fixed the code error in `readme.md` .

# v0.0.1
## Add
1. Project init.
