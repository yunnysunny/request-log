import type { Request, Response, NextFunction } from 'express';

import { address as getIpAddress } from 'ip';

// declare module 'express' {
//     interface Request {
//         session: unknown;
//     }
// }

const serverIp = getIpAddress();
const pid = process.pid;
let req_id_count = 0;

function _dataFormat(data: any, isRes: boolean, req: Request): string {
    if (typeof data === 'string') {
        return data;
    }
    return JSON.stringify(data);
}
export interface SimpleLogger {
    error: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
    trace: (...args: unknown[]) => void;
}
/**
 * Represents a callback function that is called when a request is finished.
 * @param data - The request data.
 */
export interface OnReqFinished {
    (data: RequestData): void;
}
/**
 * Represents the options for the middleware.
 */
export interface MiddlewareOptions {
    /**
     * Callback function that will be called when the request is finished.
     */
    onReqFinished?: OnReqFinished;

    /**
     * An array of custom header keys.
     */
    customHeaderKeys?: string[];

    /**
     * An array of custom environment variable names.
     */
    customEnvNames?: string[];

    /**
     * A function that formats the data before logging.
     */
    dataFormat?: (data: any, isFromResponse: boolean, req: Request) => any;

    /**
     * Specifies whether the standard output is disabled.
     */
    stdoutDisabled?: boolean;

    /**
     * An instance of a logger.
     */
    logger?: SimpleLogger;
}

/**
 * Represents the data associated with a request.
 */
export interface RequestData {
    hostname: string;
    original_url: string;
    path: string;
    router: string;
    user_agent: string;
    custom_headers: Record<string, string | undefined>;
    custom_envs: Record<string, string | undefined>;
    method: string;
    ip?: string;
    host: string;
    duration: number;
    pid: number;
    req_id: number;
    content_length_req: number;
    content_length: number;
    status_code: number;
    res_code: number;
    res_data: any;
    req_time: number;
    req_time_string: string;
    req_data: any;
    referer: string;
    session: string;
    aborted: boolean;
    created_at: number;
}

/**
 * Middleware function for logging request information.
 * 
 * @module @yunnysunny/request-logging
 *
 * @param options - The options for the middleware.
 * @returns The middleware function.
 */
export default function middleware({
    onReqFinished,
    customHeaderKeys = [],
    customEnvNames = [],
    dataFormat = _dataFormat,
    stdoutDisabled = false,
    logger = console
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
            const router = req.route?.path || req.path

            if (onReqFinished) {
                const custom_headers: { [key: string]: string | undefined } = {};
                if (customHeaderKeys && customHeaderKeys.length > 0) {
                    for (let i = 0, len = customHeaderKeys.length; i < len; i++) {
                        const key = customHeaderKeys[i];
                        custom_headers[key] = req.get(key) as string;
                    }
                }
                const custom_envs: { [key: string]: string | undefined } = {};
                if (customEnvNames && customEnvNames.length > 0) {
                    for (let i = 0, len = customEnvNames.length; i < len; i++) {
                        const key = customEnvNames[i];
                        custom_envs[key] = process.env[key];
                    }
                }
                const data: RequestData = {
                    hostname,
                    original_url,
                    path,
                    router,
                    user_agent,
                    custom_headers,
                    custom_envs,
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
                onReqFinished(data);
                // if (kafkaSchedule) {
                //     kafkaSchedule.addData(data);
                // }
                // if (mongooseModel) {
                //     const obj = new mongooseModel(data);
                //     obj.save({maxTimeMS: 500}).catch((err: Error) => {
                //         logger.error('save to mongo failed', err);
                //     });
                // }
            }

            // if (alarm) {
            //     if (status_code >= 500 && status_code < 600) {
            //         alarm.sendAll(`${status_code}:${serverIp}:${original_url}`, (err: Error | null) => {
            //             if (err) {
            //                 logger.error('发送警告数据时报错', err);
            //             }
            //         });
            //     }
            // }

            if (!stdoutDisabled) {
                logger.info(`${ip} ${duration} ms ${content_length_req} "${method} ${original_url} HTTP/${req.httpVersion}" ${status_code} ${content_length} "${referer}" "${user_agent}"`);
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
