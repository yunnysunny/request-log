const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const {
    slogger,
    port,
} = require('./config');
import requestLog  from '../../../lib';
import { Request, Response, NextFunction } from "express";
const app = express();
app.enable('trust proxy');

// view engine setup
app.set('port', port);
app.use(requestLog({}));

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '1mb'
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
    const err: any = new Error('Not Found:' + req.path);
    err.status = 404;
    next(err);
});

// error handlers
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
    const status: number = err.status;
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
