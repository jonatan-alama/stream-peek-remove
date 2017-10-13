const Readable = require("stream").Readable;
const tape = require("tape");
const streamPeekRemove = require("../lib/index");

function readableStream(string) {
  const input = new Readable();
  input.push(string);
  input.push(null);

  return input;
}

tape("default options", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  const output = [];
  
  const stream = new streamPeekRemove(input, null, (err, buffer) => {
    t.equals(buffer.toString("utf8"), string.slice(0, 16), "peek buffer contains first 16 bytes");

    stream.on("data", (chunk) => output.push(chunk));
    stream.on("end", () => {
      t.equals(output.toString("utf8"), string.slice(16), "resulting stream removes the first 16 bytes and returns the rest");
      t.end();
    })
  });
});

tape("0 bytes, default remove", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  const output = [];
  
  const stream = new streamPeekRemove(input, { bytes: 0 }, (err, buffer) => {
    t.equals(buffer.length, 0, "peek buffer is empty");

    stream.on("data", (chunk) => output.push(chunk));
    stream.on("end", () => {
      t.equals(output.toString("utf8"), string, "resulting stream removes nothing");
      t.end();
    })
  });
});

tape("0 bytes, remove is false", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  const output = [];
  
  const stream = new streamPeekRemove(input, { bytes: 0, remove: false }, (err, buffer) => {
    t.equals(buffer.length, 0, "peek buffer is empty");

    stream.on("data", (chunk) => output.push(chunk));
    stream.on("end", () => {
      t.equals(output.toString("utf8"), string, "resulting stream removes nothing");
      t.end();
    })
  });
});

tape("Equal bytes than actual stream length, default remove", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  const output = [];
  
  const stream = new streamPeekRemove(input, { bytes: string.length }, (err, buffer) => {
    t.equals(buffer.length, string.length, "peek buffer length is equal to the input length");
    t.equals(buffer.toString("utf8"), string, "peek buffer contains the whole stream data");

    stream.on("data", (chunk) => output.push(chunk));
    stream.on("end", () => {
      t.equals(output.length, 0, "resulting stream is empty");
      t.end();
    })
  });
});

tape("Equal bytes than actual stream length, remove is false", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  const output = [];
  
  const stream = new streamPeekRemove(input, { bytes: string.length, remove: false }, (err, buffer) => {
    t.equals(buffer.length, string.length, "peek buffer length is equal to the input length");
    t.equals(buffer.toString("utf8"), string, "peek buffer contains the whole stream data");

    stream.on("data", (chunk) => output.push(chunk));
    stream.on("end", () => {
      t.equals(output.toString("utf8"), string, "resulting stream contains the whole stream data");
      t.end();
    })
  });
});

tape("More bytes than actual stream length, default remove", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  const output = [];
  
  const stream = new streamPeekRemove(input, { bytes: string.length + 10 }, (err, buffer) => {
    t.equals(buffer.length, string.length, "peek buffer length is equal to the input length");
    t.equals(buffer.toString("utf8"), string, "peek buffer contains the whole stream data");
    
    stream.on("data", (chunk) => output.push(chunk));
    stream.on("end", () => {
      t.equals(output.length, 0, "resulting stream is empty");
      t.end();
    })
  });
});

tape("More bytes than actual stream length, remove is false", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  const output = [];
  
  const stream = new streamPeekRemove(input, { bytes: string.length + 10, remove: false }, (err, buffer) => {
    t.equals(buffer.length, string.length, "peek buffer length is equal to the input length");
    t.equals(buffer.toString("utf8"), string, "peek buffer contains the whole stream data");
    
    stream.on("data", (chunk) => output.push(chunk));
    stream.on("end", () => {
      t.equals(output.toString("utf8"), string, "resulting stream contains the whole stream data");
      t.end();
    })
  });
});