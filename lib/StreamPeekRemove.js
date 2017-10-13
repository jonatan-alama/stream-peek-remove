const stream = require("stream");

const PEEK_BYTES = 16;
const REMOVE = true;

class StreamPeekRemove extends stream.Transform {
  constructor(options = {}) {
    super(options);

    this._peekRemoveState = {
      buffer: [],
      readBytes: 0,
      finished: false
    };

    this._peekRemoveOptions = {
      peekBytes: options.bytes != undefined ? options.bytes : PEEK_BYTES,
      remove: options.remove != undefined ? options.remove : REMOVE
    };
  }
  _transform(chunk, enc, callback) {
    const state = this._peekRemoveState;
    const { peekBytes } = this._peekRemoveOptions;

    state.buffer.push(chunk);
    state.readBytes += chunk.length;

    if (state.readBytes >= peekBytes) {
      this._peekRemove(callback);
    } else {
      callback();
    }
  }
  _flush(callback) {
    const state = this._peekRemoveState;

    if (state.finished) {
      callback();
    } else {
      this._peekRemove(callback);
    }
  }
  _peekRemove(callback) {
    const state = this._peekRemoveState;
    const { peekBytes, remove } = this._peekRemoveOptions;
    const buffer = Buffer.concat(state.buffer);

    this.emit("peekRemove", buffer.slice(0, peekBytes));

    if (remove) {
      this.push(buffer.slice(peekBytes));
    } else {
      this.push(buffer);
    }

    state.buffer = null;
    state.readBytes = null;
    state.finished = true;

    this._transform = stream.PassThrough;

    callback();
  }
}

StreamPeekRemove.PEEK_BYTES = PEEK_BYTES;
StreamPeekRemove.REMOVE = REMOVE;

module.exports = StreamPeekRemove;
