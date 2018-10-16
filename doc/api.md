<a name="module_req-log"></a>

## req-log

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.kafkaSchedule] | <code>Object</code> | The instance of class KafkaProducer from the package of [queue-schedule](https://npmjs.com/package/queue-schedule). |
| [options.mongooseModel] | <code>Object</code> | The instance of a mongoose Model to save the request log. |
| [options.alarm] | <code>Object</code> | The alarm object, it should has the function of sendAll. |

