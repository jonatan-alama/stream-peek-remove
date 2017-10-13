const StreamPeekRemove = require("./StreamPeekRemove");

function streamPeekRemove(source, options, callback) {
  options = options || {};
  const dest = new StreamPeekRemove(options);

  dest.once("peekRemove", function(buffer) {
    callback && callback(null, buffer);
  });

  return source.pipe(dest);
}

streamPeekRemove.StreamPeekRemove = StreamPeekRemove;

module.exports = streamPeekRemove;
