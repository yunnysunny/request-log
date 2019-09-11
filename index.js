const slogger = require('node-slogger');
const serverIp = require('ip').address();
const pid = process.pid;
var req_id_count = 0;
/**
 * @module req-log
 * @param {Object} options
 * @param {Object=} options.kafkaSchedule The instance of class KafkaProducer from the package of [queue-schedule](https://npmjs.com/package/queue-schedule). 
 * @param {Object=} options.mongooseModel The instance of a mongoose Model to save the request log.
 * @param {Object=} options.alarm The alarm object, it should has the function of sendAll.
 * @param {String[]} [options.customHeaderKeys=[]] The data indicates the specific headers to store into mongo and kafka.
 */
module.exports = function({kafkaSchedule=null,mongooseModel=null,alarm=null,customHeaderKeys=[]}={}) {
    return function(req, res, next) {
        //记录请求时间
        const date = new Date();
        const req_time = date.getTime();
        const req_time_string = date.toISOString();
        const req_id = req_id_count++;
        const origianlEnd = res.end;
        res.end = function() {
            origianlEnd.apply(res,arguments);
            //记录响应时间
            const now = Date.now();
            const duration = now - req_time;
            const method = req.method;
            
            const ip = req.ip;
            const original_url = req.originalUrl;
            const user_agent = req.get('User-Agent') || '';
            const hostname = req.hostname;
            const path = req.path;
            const content_length = res._contentLength;
            const status_code = res.statusCode;
            const res_code = Number(res.get('res-code')) || 0;
            const req_data = method === 'POST' ?
                req.body :
                req.query;
            const referer = req.get('referer') || '';
            const session = req.session;
            
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
                    content_length,
                    status_code,
                    res_code,
                    req_time,
                    req_time_string,
                    req_data,
                    referer,
                    session,
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
    
            
            slogger.info(`${ip} ${duration} ms "${method} ${original_url} HTTP/${req.httpVersion}" ${status_code} ${content_length} "${referer}" "${user_agent}"`);
        };
        // res.on('finish', function() {
            
        // });
    
        next();
    };
}; 