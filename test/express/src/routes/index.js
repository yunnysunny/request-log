const express = require('express');
const router = express.Router();
router.get('/', function(req, res) {
    res.sendStatus(200);
});
router.get('/do-login', function(req, res) {
    req.session.user = {name:'test',user_type:1};
    res.send('welcome home');
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

module.exports = router;
