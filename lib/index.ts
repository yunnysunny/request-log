import type { Request, Response, NextFunction } from 'express';

import type { Model } from 'mongoose';

import { address as getIpAddress } from 'ip';

interface KafkaProducer {
    addData(data: unknown): void;
}
// declare module 'express' {
//     interface Request {
//         session: unknown;
//     }
// }

const serverIp = getIpAddress();
const pid = process.pid;
let req_id_count = 0;

function _dataFormat(data: any): any {
    return data;
}

interface MiddlewareOptions {
    kafkaSchedule?: KafkaProducer | null;
    mongooseModel?: Model<any> | null;
    alarm?: { sendAll: (message: string, callback: (err: Error | null) => void) => void } | null;
    customHeaderKeys?: string[];
    dataFormat?: (data: any, isFromResponse: boolean, req: Request) => any;
    stdoutDisabled?: boolean;
}

function middleware({
    kafkaSchedule = null,
    mongooseModel = null,
    alarm = null,
    customHeaderKeys = [],
    dataFormat = _dataFormat,
    stdoutDisabled = false,
}: MiddlewareOptions = {}) {
    return function (req: Request, res: Response, next: NextFunction) {
        const date = new Date();
        const req_time = date.getTime();
        const req_time_string = date.toISOString();
        const req_id = req_id_count++;
        let aborted = false;
        let hasLoged = false;

        function doLog() {
            if (hasLoged) {
                return //slogger.trace('has loged');
            }
            const now = Date.now();
            const duration = now - req_time;
            const method = req.method;
            const ip = req.ip;
            const original_url = req.originalUrl;
            const user_agent = req.get('User-Agent') || '';
            const hostname = req.hostname;
            const path = req.path;
            const content_length = Number(res.get('content-length')) || -1;
            const status_code = res.statusCode;
            const res_code = Number(res.get('res-code')) || 0;
            const content_length_req = Number(req.get('content-length')) || 0;
            const req_data_original = method === 'POST' ? req.body : req.query;
            const req_data = dataFormat(req_data_original, false, req);
            const referer = req.get('referer') || '';
            const session = (req as any).session;
            const res_data = dataFormat(res.locals._res_data, true, req);

            if (kafkaSchedule || mongooseModel) {
                const custom_headers: { [key: string]: string | undefined } = {};
                if (customHeaderKeys && customHeaderKeys.length > 0) {
                    for (let i = 0, len = customHeaderKeys.length; i < len; i++) {
                        const key = customHeaderKeys[i];
                        custom_headers[key] = req.get(key);
                    }
                }
                const data = {
                    hostname,
                    original_url,
                    path,
                    user_agent,
                    custom_headers,
                    method,
                    ip,
                    host: serverIp,
                    duration,
                    pid,
                    req_id,
                    content_length_req,
                    content_length,
                    status_code,
                    res_code,
                    res_data,
                    req_time,
                    req_time_string,
                    req_data,
                    referer,
                    session,
                    aborted,
                    created_at: now
                };

                if (kafkaSchedule) {
                    kafkaSchedule.addData(data);
                }
                if (mongooseModel) {
                    new mongooseModel(data).save((err: Error) => {
                        if (err) {
                            //slogger.error('save request log to mongodb failed', err);
                        }
                    });
                }
            }

            if (alarm) {
                if (status_code >= 500 && status_code < 600) {
                    alarm.sendAll(`${status_code}:${serverIp}:${original_url}`, (err: Error | null) => {
                        if (err) {
                            //slogger.error('发送警告数据时报错', err);
                        }
                    });
                }
            }

            if (!stdoutDisabled) {
                //slogger.info(`${ip} ${duration} ms ${content_length_req} "${method} ${original_url} HTTP/${req.httpVersion}" ${status_code} ${content_length} "${referer}" "${user_agent}"`);
            }
        }

        res.on('close', () => {
            aborted = !res.writableFinished;
            doLog();
            hasLoged = true;
        });
        res.on('finish', () => {
            doLog();
            hasLoged = true;
        });
        req.on('aborted', () => {
            aborted = true;
            doLog();
            hasLoged = true;
        });
        req.on('error', () => {
            doLog();
            hasLoged = true;
        });
        next();
    };
}

export default middleware;