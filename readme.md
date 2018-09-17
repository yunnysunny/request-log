# request-logging

Print the express request log to console and save it to kafka when required, and even can send alram message when the response code greater than 500.

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

## License

[MIT](https://github.com/yunnysunny/request-log/blob/HEAD/LICENSE)
