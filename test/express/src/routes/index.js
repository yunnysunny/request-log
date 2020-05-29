const express = require('express');
const multipart = require('connect-multiparty');
const router = express.Router();
const multipartMiddleware = multipart({ uploadDir: 'path' });
const {callService} = require('../helpers/controller_helper');
router.get('/', function(req, res) {
    res.sendStatus(200);
});
router.get('/do-login', function(req, res) {
    req.session.user = {name:'test',user_type:1};
    res.send({code:0});
});
router.get('/login-check',function(req, res) {
    if (req.session && req.session.user && req.session.user.name === 'test') {
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
    
});

router.get('/do-get-res-code',function(req, res) {
    res.set('res-code',1000);
    res.sendStatus(200);
});

router.get('/abort',function(req, res) {
    req.socket.destroy();
    res.send('not sended');
});

router.post('/post', multipartMiddleware, function(req, res) {
    res.send(req.body);
});

function echoService (data, callback) {
    callback(null,data);
}

router.post('/echo', function(req, res) {
    // res.send(req.body);
    callService(req, res, echoService, req.body);
});

module.exports = router;
