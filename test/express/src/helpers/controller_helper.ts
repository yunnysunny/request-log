import { Request, Response } from "express";

exports.callService = function(req: Request, res: Response, service: Function, ...args: any[]) {
    args.push(function serviceCallback(err: any, data: any) {
        if (err) {
            return res.send(err);
        }
        const result = { code: 0, data };
        res.locals._res_data = result;
        res.send(result);
    });
    service(...args);
};

exports.callServiceWithRawReturn = function(req: Request, res: Response, service: Function, ...args: any[]) {
    args.push(function(err: any, data: any) {
        if (err) {
            return res.send(err);
        }
        res.send({data});
    });
    service(...args);
};
