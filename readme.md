# req-log

Print the express request log to console and save it to kafka when required, and even can send alram message when the response code greater than 500.

[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]

[npm-url]: https://npmjs.org/package/req-log
[travis-image]: https://img.shields.io/travis/yunnysunny/req-log.svg?style=flat-square
[travis-url]: https://travis-ci.org/yunnysunny/req-log
[david-image]: https://img.shields.io/david/yunnysunny/req-log.svg?style=flat-square
[david-url]: https://david-dm.org/yunnysunny/req-log
[node-image]: https://img.shields.io/badge/node.js-%3E=_6-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

[![NPM](https://nodei.co/npm/req-log.png?downloads=true)](https://nodei.co/npm/node-req-log/)  

## Usage

```
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
