const http = require('http');

let clientReq;
const server = http.createServer(function (req, res) {
    req.on('aborted', function () {
        console.log('ABORTED');
        server.close();
    });

    req.on('end', () => {
        console.log('DESTROY');
        clientReq.destroy();
    });
	
    req.resume(); // read all client data
    res.on('finish', function() {
        console.log('res finish');
    });
    res.on('close', function() {
        console.log('res close');
    });
});

server.listen(5000, () => {
    clientReq = http.request({
        method: 'POST',
        port: server.address().port,
        headers: { connection: 'keep-alive' }
    }, (res) => {
    });

    clientReq.on('error', (err) => console.log('CLIENT ERROR', err));

    clientReq.end();
});