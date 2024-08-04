# v0.16.0
## Breaking changes
1. Remove `kafkaSchedule` `mongooseModel` `alarm` option, please use `onReqFinished` instead.
2. The default `dataFormat` function will use JSON.stringify to return string, since it's safe for elasticsearch. If you want to return with you own format, please pass the `dataFormat` parameter yourself. 
## Add
1. Add support for esm module.
2. Add `router` field.
# v0.15.2
## Fix
1. Fix log not recorded on node 16+ when client close the http underlay socket. see issue [40775](https://github.com/nodejs/node/issues/40775) on node also.

# v0.15.1
## Fix
1. Fix document url.

# v0.15.0
## Add
1. Add `stdoutDisabled` parameter to middleware.

# v0.14.0
## Add
1. Add express.Request parameter to FormatFunction.

# v0.13.0
## Add
1. Add support for typescript.

# v0.12.1
## Remove
1. Remove the default value of response data. You should avoid reading undefined object in `dataFormat` function when format response data.

# v0.12.0
## Add
1. Add the field of `res_data`, which contains the reponse data.

# v0.11.1
## Fix
1. Fix the issue of https://github.com/yunnysunny/request-log/issues/2

# v0.11.0
## Add
1. Add the field of `aborted` to indicate whether the request is aborted.

# v0.10.0
## Add
1. Add the parameter of `dataFormat` to resolve the conflict occured in elasticsearch.

# v0.9.0
## Add
1. Add the key of `content_length_req` to indicate the length of the request.

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
