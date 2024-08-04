import { Request, Response, NextFunction } from "express";
const express = require('express');
const multipart = require('connect-multiparty');
const router = express.Router();
const multipartMiddleware = multipart({ uploadDir: 'path' });
const {callService} = require('../helpers/controller_helper');
declare module 'express-session' {
    interface SessionData {
      user: {
        name: string;
        user_type: number;
      };
    }
  }
router.get('/', function(req: Request, res: Response) {
    res.sendStatus(200);
});
router.get('/do-login', function(req: Request, res: Response) {
    req.session.user = {name:'test',user_type:1};
    res.send({code:0});
});
router.get('/login-check',function(req: Request, res: Response) {
    if (req.session && req.session.user && req.session.user.name === 'test') {
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
    
});

router.get('/do-get-res-code',function(req: Request, res: Response) {
    res.set('res-code','1000');
    res.sendStatus(200);
});

router.get('/abort',function(req: Request, res: Response) {
    req.socket.destroy();
    res.send('not sended');
});

router.post('/post', multipartMiddleware, function(req: Request, res: Response) {
    res.send(req.body);
});

interface EchoServiceData {
    // Define the structure of the data parameter
    // Add properties and their types as needed
}

type EchoServiceCallback = (error: Error | null, data: any) => void;

function echoService(data: EchoServiceData, callback: EchoServiceCallback) {
    callback(null, data);
}

router.post('/echo', function(req: Request, res: Response) {
    // res.send(req.body);
    callService(req, res, echoService, req.body);
});

module.exports = router;
