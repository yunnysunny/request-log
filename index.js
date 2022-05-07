const slogger = require('node-slogger');
const serverIp = require('ip').address();
const pid = process.pid;
var req_id_count = 0;

function _dataFormat(data) {
    return data;
}
/**
 * The default format function
 * @callback  FormatFunction
 * 
 * @param {object} data The original data.
 * @param {Boolean} isFromResponse Whether the data is from response.
 * @param {import('express').Request} req The express request object
 * @return {object|any} The data after format.
 */

/**
 * @module @yunnysunny/request-logging
 * @param {object} options
 * @param {object=} options.kafkaSchedule The instance of class KafkaProducer from the package of [queue-schedule](https://npmjs.com/package/queue-schedule). 
 * @param {object=} options.mongooseModel The instance of a mongoose Model to save the request log.
 * @param {object=} options.alarm The alarm object, it should has the function of sendAll.
 * @param {String[]} [options.customHeaderKeys=[]] The data indicates the specific headers to store into mongo and kafka.
 * @param {FormatFunction=} options.dataFormat The custom data format function, it use to resolve the conflict occured in elasticsearch.
 * @param {Boolean=} [options.stdoutDisabled=false] Whether to print access log to console.
 */
function middleware({
    kafkaSchedule=null,
    mongooseModel=null,
    alarm=null,
    customHeaderKeys=[],
    dataFormat=_dataFormat,
    stdoutDisabled=false,
}={}) {
    return function(req, res, next) {
        //begin
        const date = new Date();
        const req_time = date.getTime();
        const req_time_string = date.toISOString();
        const req_id = req_id_count++;
        // const origianlEnd = res.end;
        var aborted = false;
        var hasLoged = false;

        function doLog() {
            if (hasLoged) {
                return slogger.trace('has loged');
            }

            const now = Date.now();//end
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
            const req_data_original = method === 'POST' ?
                req.body :
                req.query;
            const req_data = dataFormat(req_data_original, false, req);
            const referer = req.get('referer') || '';
            const session = req.session;
            const res_data = dataFormat(res._res_data, true, req);
            
            if (kafkaSchedule || mongooseModel) {
                const custom_headers = {};
                if (customHeaderKeys && customHeaderKeys.length > 0) {
                    for (var i=0,len=customHeaderKeys.length;i<len;i++) {
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
                    host:serverIp,
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
                    new mongooseModel(data).save(function(err) {
                        if (err) {
                            slogger.error('save request log to mongodb failed',err);
                        }
                    });
                }
            }
            
            if (alarm) {
                if (status_code >= 500 && status_code < 600) {
                    alarm.sendAll(`${status_code}:${serverIp}:${original_url}`, function(err) {
                        if (err) {
                            slogger.error('发送警告数据时报错', err);
                        }
                    });
                }
            }
    
            if (!stdoutDisabled) {
                slogger.info(`${ip} ${duration} ms ${content_length_req} "${method} ${original_url} HTTP/${req.httpVersion}" ${status_code} ${content_length} "${referer}" "${user_agent}"`);
            }
        }

        // res.end = function() {
        //     origianlEnd.apply(res,arguments);
        //     doLog();
        // };
        res.on('finish', function() {
            doLog();
            hasLoged = true;
        });
        req.on('aborted',function() {
            aborted = true;
            doLog();
            hasLoged = true;
        });
        req.on('error', function() {
            doLog();
            hasLoged = true;
        });
        next();
    };
}

module.exports = middleware; 