import middleware from '../../'

middleware({dataFormat: function(data, isRes, req) {
    req.url === '';
    return JSON.stringify(data);
}});