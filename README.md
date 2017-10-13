# stream-peek-remove
Node stream Transform that extracts the first n bytes from a stream

`npm install stream-peek-remove`

## Usage

Imagine a file with a given prefix we want to extract and remove from the stream:

`[10_BYTES]rest of the file contents`

```javascript
const streamPeekRemove = require("stream-peek-remove");
const fs = require("fs");

const readStream = fs.createReadStream("myFileToRead");
const options = {
  bytes: 10, // [10_BYTES] length
  remove: true
}
const peekRemove = streamPeekRemove(readStream, options, (err, peek) => {
  console.log(peek.toString("utf8")); // [10_BYTES]

  peekRemove.pipe(other_stream); // Streams only "rest of the file contents"
});
```

### Parameters
```javascript
streamPeekRemove(readStream, options, callback);
```

**`readStream`** A readable stream

**`options`** An object with the following parameters:

- `bytes` The number of bytes to peek. Default is `16`
- `remove` A boolean. If true, the peeked bytes are removed from the stream. If false, the stream is kept intact. Default is `true`

**callback** A function to be called withe the peeked bytes:
```javascript
  function(error, peek)
```

- `error` An error. Not implemented right now, added for consistency
- `peek` A Buffer with the peeked bytes

## License
MIT