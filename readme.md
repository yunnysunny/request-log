# request-logging

Print the express request log to console and save it to kafka when required, and even can send alram message when the response code greater than 500.

[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]

[npm-url]: https://npmjs.org/package/@yunnysunny/request-logging
[travis-image]: https://img.shields.io/travis/yunnysunny/request-log.svg?style=flat-square
[travis-url]: https://travis-ci.org/yunnysunny/request-log
[david-image]: https://img.shields.io/david/yunnysunny/@yunnysunny/request-logging.svg?style=flat-square
[david-url]: https://david-dm.org/yunnysunny/@yunnysunny/request-logging
[node-image]: https://img.shields.io/badge/node.js-%3E=_6-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[coveralls-image]: https://img.shields.io/coveralls/yunnysunny/request-log.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yunnysunny/request-log?branch=master

[![NPM](https://nodei.co/npm/@yunnysunny/request-logging.png?downloads=true)](https://nodei.co/npm/@yunnysunny/request-logging)  

## Usage

```javascript
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const requestLog = require('req-log');

const app = express();
app.enable('trust proxy');

// view engine setup
app.set('port', port);
app.use(requestLog({kafkaSchedule}));

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '1mb'
}));
```

## API

See [api](doc/api.md) document.

## License

[MIT](LICENSE)
