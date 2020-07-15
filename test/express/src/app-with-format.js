const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const {
    slogger,
    port,
    requestLogModel,
    CUSTOM_HEADER_KEY_MY_ID,
    TO_FORMAT_FIELD,
    FORMAT_SUFFIX
} = require('./config');
const requestLog = require('../../../index');

const app = express();
app.enable('trust proxy');

// view engine setup
app.set('port', port);
app.use(requestLog({
    mongooseModel:requestLogModel,
    customHeaderKeys: [CUSTOM_HEADER_KEY_MY_ID],
    dataFormat: function(data, isFromRes) {
        if (isFromRes) {
            return;
        }
        data[TO_FORMAT_FIELD] = (data[TO_FORMAT_FIELD] || '') + FORMAT_SUFFIX;
        return data;
    }
}));

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '1mb'
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found:' + req.path);
    err.status = 404;
    next(err);
});

// error handlers
app.use(function(err, req, res, next) {
    const status = err.status;
    if (status === 404) {
        return res.status(404).send(err.message || '未知异常');
    }
    res.status(status || 500);
    slogger.error('发现应用未捕获异常', err);
    res.send({
        msg: err.message || '未知异常',
        code: 0xffff
    });
});


module.exports = app;
