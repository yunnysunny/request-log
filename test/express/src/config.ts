// const slogger = require('node-slogger');
import { Slogger } from 'node-slogger';
import * as fs from 'fs';
const { Kafka } = require('kafkajs');
const { KafkaJsProducer } = require('queue-schedule');
const mongoose = require('mongoose');
import { requestLogSchema } from './schemas/request_log_schema';
const configObj = require('../config.json');
const settings = require('config-settings').init(configObj);

exports.CUSTOM_HEADER_KEY_MY_ID = 'my-id';
exports.port = settings.loadNecessaryInt('port');
exports.TO_FORMAT_FIELD = 'myformat';
exports.FORMAT_SUFFIX = '_format';
//保证配置文件中的debugfilename属性存在，且其所在目录在当前硬盘中存在

const errorFile = settings.loadNecessaryFile('errorLogFile', true);

// slogger.init({
//     logFiles:[
//         {category:'error',filename:errorFile}
//     ]
// });
const slogger = new Slogger({
    streams: {
        error: fs.createWriteStream(errorFile)
    }
});
exports.slogger = slogger;

const kafkaHost = settings.loadNecessaryVar('kafkaConfig.peers');
const topic = settings.loadNecessaryVar('kafkaConfig.topic');
const client =  new Kafka({
    brokers: [kafkaHost]
});
exports.kafkaSchedule = new KafkaJsProducer({
    topic: topic,
    delayInterval:1000,
    client
});
let mongoConfig = settings.loadNecessaryObject('mongoConfig');
mongoose.Promise = global.Promise;

mongoose.connect(mongoConfig.url, mongoConfig.option); // connect to database
exports.requestLogModel = mongoose.model('RequestLog', requestLogSchema);
export const requestLogModel = exports.requestLogModel;
process.on('unhandledRejection', err => {
    // eslint-disable-next-line no-console
    slogger.error('unhandledRejection:', err)
})