exports.callService = function(req, res, service,...args) {
    args.push(function serviceCallback(err,data) {
        if (err) {
            return res.send(err);
        }
        const result = {code:0,data};
        res._res_data = result;
        res.send(result);
    });
    service(...args);
};

exports.callServiceWithRawReturn = function(req, res, service,...args) {
    args.push(function(err,data) {
        if (err) {
            return res.send(err);
        }
        res.send({data});
    });
    service(...args);
};
