const slogger = require('node-slogger');
const { Kafka } = require('kafkajs');
const { KafkaJsProducer } = require('queue-schedule');
const mongoose = require('mongoose');
const configObj = require('../config.json');
const settings = require('config-settings').init(configObj);

exports.CUSTOM_HEADER_KEY_MY_ID = 'my-id';
exports.port = settings.loadNecessaryInt('port');
exports.TO_FORMAT_FIELD = 'myformat';
exports.FORMAT_SUFFIX = '_format';
//保证配置文件中的debugfilename属性存在，且其所在目录在当前硬盘中存在

const errorFile = settings.loadNecessaryFile('errorLogFile', true);

slogger.init({
    logFiles:[
        {category:'error',filename:errorFile}
    ]
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
exports.requestLogModel = mongoose.model('RequestLog',require('./schemas/request_log_schema'));