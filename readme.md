# request-logging

Print the express request log to console and save it to kafka and mongodb when required, and even can send alram message when the response code greater than 500.

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
const requestLog = require('@yunnysunny/request-logging');

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

See [api](https://github.com/yunnysunny/request-log/blob/HEAD/doc/api.md) document.

## Fields

If you want to save request logging to mongodb, this is the fields description, which you will used to create a mongoose schema:  

| name           | type   | description                                                  |
| -------------- | ------ | ------------------------------------------------------------ |
| host           | String | The server's ip.                                             |
| original_url   | String | The original url contains query string.                      |
| path           | String | The request path doesn't contain query string.               |
| user_agent     | String | The user agent.                                              |
| method         | String | The http request method.                                     |
| ip             | String | The client's ip.                                             |
| duration       | Number | The millisecond the request costed.                          |
| pid            | Number | The server's process id.                                     |
| req_id         | Number | The inner request number, auto increased when new request come. |
| content_length | Number | The content-length of the response headers.                  |
| status_code    | Number | The status code of current HTTP response.                    |
| req_time       | Number | The timestamp of begin time of current request occured.      |
| req_data       | Object | The request data, which would form query string or form data. |
| referer        | String | The HTTP referer header.                                     |
| session        | Object | The session of current request.                              |

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


## License

[MIT](https://github.com/yunnysunny/request-log/blob/HEAD/LICENSE)
