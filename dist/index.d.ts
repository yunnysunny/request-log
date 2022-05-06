export = middleware;
/**
 * The default format function
 * @callback  FormatFunction
 *
 * @param {object} data The original data.
 * @param {Boolean=} isFromResponse Whether the data is from response.
 * @return {object|any} The data after format.
 */
/**
 * @module req-log
 * @param {object} options
 * @param {object=} options.kafkaSchedule The instance of class KafkaProducer from the package of [queue-schedule](https://npmjs.com/package/queue-schedule).
 * @param {object=} options.mongooseModel The instance of a mongoose Model to save the request log.
 * @param {object=} options.alarm The alarm object, it should has the function of sendAll.
 * @param {String[]} [options.customHeaderKeys=[]] The data indicates the specific headers to store into mongo and kafka.
 * @param {FormatFunction=} options.dataFormat The custom data format function, it use to resolve the conflict occured in elasticsearch.
 */
declare function middleware({ kafkaSchedule, mongooseModel, alarm, customHeaderKeys, dataFormat }?: {
    kafkaSchedule?: object | undefined;
    mongooseModel?: object | undefined;
    alarm?: object | undefined;
    customHeaderKeys?: string[];
    dataFormat?: FormatFunction | undefined;
}): (req: any, res: any, next: any) => void;
declare namespace middleware {
    export { FormatFunction };
}
/**
 * The default format function
 */
type FormatFunction = (data: object, isFromResponse?: boolean | undefined) => object | any;
//# sourceMappingURL=index.d.ts.map