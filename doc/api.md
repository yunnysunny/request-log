## Modules

<dl>
<dt><a href="#module_req-log">req-log</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#FormatFunction">FormatFunction(data)</a> ⇒ <code>Object</code></dt>
<dd><p>The default format function</p>
</dd>
</dl>

<a name="module_req-log"></a>

## req-log

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| [options.kafkaSchedule] | <code>Object</code> |  | The instance of class KafkaProducer from the package of [queue-schedule](https://npmjs.com/package/queue-schedule). |
| [options.mongooseModel] | <code>Object</code> |  | The instance of a mongoose Model to save the request log. |
| [options.alarm] | <code>Object</code> |  | The alarm object, it should has the function of sendAll. |
| [options.customHeaderKeys] | <code>Array.&lt;String&gt;</code> | <code>[]</code> | The data indicates the specific headers to store into mongo and kafka. |
| [options.dataFormat] | [<code>FormatFunction</code>](#FormatFunction) |  | The custom data format function, it use to resolve the conflict occured in elasticsearch. |

<a name="FormatFunction"></a>

## FormatFunction(data) ⇒ <code>Object</code>
The default format function

**Kind**: global function  
**Returns**: <code>Object</code> - The data after format.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The original data. |

