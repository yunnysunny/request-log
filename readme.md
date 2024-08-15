# request-logging

Print the express request log to console or save it to external data source by providing `onReqFinished` callback function. 

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]

[npm-image]: https://img.shields.io/npm/v/@yunnysunny/request-logging.svg?style=flat
[npm-url]: https://npmjs.org/package/@yunnysunny/request-logging
[travis-image]: https://img.shields.io/travis/yunnysunny/request-log.svg?style=flat-square
[travis-url]: https://travis-ci.org/yunnysunny/request-log
[david-image]: https://img.shields.io/david/yunnysunny/@yunnysunny/request-logging.svg?style=flat-square
[david-url]: https://david-dm.org/yunnysunny/@yunnysunny/request-logging
[node-image]: https://img.shields.io/badge/node.js-%3E=_6-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[coveralls-image]: https://img.shields.io/coveralls/yunnysunny/request-log.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yunnysunny/request-log?branch=master



## Installation
```npm install @yunnysunny/request-logging --save```

## Usage

```javascript
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const requestLog = require('@yunnysunny/request-logging').default;

const app = express();
app.enable('trust proxy');

// view engine setup
app.set('port', port);
app.use(requestLog());

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '1mb'
}));
```

## API

See [api](https://request-log.whyun.com/functions/middleware.html) document.

## Fields

If you want to save request logging to mongodb, this is the fields description, which you will used to create a mongoose schema:  

| name           | type   | description                                                  |
| -------------- | ------ | ------------------------------------------------------------ |
| req_id         | String | The unique id for one log record, can been changed by given `genId` function.|
| domain         | String | The domain of current server.                                |
| original_url   | String | The original url contains query string.                      |
| path           | String | The request path doesn't contain query string.               |
| router         | String | The request router for express.                              |
| user_agent     | String | The user agent.                                              |
| custom_headers | Object | The specific headers you wanna save.                         | 
| custom_envs    | Object | The specific env variables you wanna save.                   | 
| method         | String | The http request method.                                     |
| ip             | String | The client's ip.                                             |
| server_ip      | String | The server's ip.                                             |
| server_host    | String | The server's hostname.                                       |
| duration       | Number | The millisecond the request costed.                          |
| pid            | Number | The server's process id.                                     |
| req_seq        | Number | The inner request number, auto increased when new request come. |
| content_length_req | Number | The content-length of the request headers.                  |
| content_length | Number | The content-length of the response headers.                  |
| status_code    | Number | The status code of current HTTP response.                    |
| res_code       | Number | The inner response code, which will been get from the response header of `res-code` or `res.locals._res_code`. |
| res_data       | String/any | The response data, which will been get from `res.locals._res_data`. |
| req_time       | Number | The timestamp of begin time of current request occured.      |
| req_time_string| String | The time of begin time, formatted in [ISO 8601 Extended Format](https://en.wikipedia.org/wiki/ISO_8601). | 
| req_data       | String/any | The request data, which would form query string or form data. |
| referer        | String | The HTTP referer header.                                     |
| session        | Object | The session of current request.                              |
| aborted        | Boolean| Whether the request has aborted.                             | 

We suggest you use such mongoose schema, which is compatible when the fields is changed:

```javascript
const {Schema} = require('mongoose');

const requestLogSchema =  new Schema({
    req_time: Date
},{ 
    timestamps: {
        createdAt: 'created_at',
        updatedAt : 'updated_at'
    },
    strict: false
});
module.exports = requestLogSchema;
```

## Breaking changes
### 0.17.x
1. `req_id` is now an unique string, the original `req_id` has renamed to `req-seq`.
2. `host` is renamed to `server_ip`.
3. `hostname` is renamed to `domain`.
### 0.16.x
1. Remove `kafkaSchedule` `mongooseModel` `alarm` option, please use `onReqFinished` instead.
2. The default `dataFormat` function will use JSON.stringify to return string, since it's safe for elasticsearch. If you want to return with you own format, please pass the `dataFormat` parameter yourself. 

## License

[MIT](https://github.com/yunnysunny/request-log/blob/HEAD/LICENSE)
