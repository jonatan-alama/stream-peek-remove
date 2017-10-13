const Readable = require("stream").Readable;
const tape = require("tape");
const streamPeekRemove = require("../lib/index");
const fs = require("fs");

function readableStream(string) {
  const input = new Readable();
  input.push(string);
  input.push(null);

  return input;
}

tape("default options", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  let output = new Buffer([]);

  const stream = new streamPeekRemove(input, null, (err, buffer) => {
    t.equals(
      buffer.toString("utf8"),
      string.slice(0, 16),
      "peek buffer contains first 16 bytes"
    );

    stream.on("data", chunk => (output = Buffer.concat([output, chunk])));
    stream.on("end", () => {
      t.equals(
        output.toString("utf8"),
        string.slice(16),
        "resulting stream removes the first 16 bytes and returns the rest"
      );
      t.end();
    });
  });
});

tape("0 bytes, default remove", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  let output = new Buffer([]);

  const stream = new streamPeekRemove(input, { bytes: 0 }, (err, buffer) => {
    t.equals(buffer.length, 0, "peek buffer is empty");

    stream.on("data", chunk => (output = Buffer.concat([output, chunk])));
    stream.on("end", () => {
      t.equals(
        output.toString("utf8"),
        string,
        "resulting stream removes nothing"
      );
      t.end();
    });
  });
});

tape("0 bytes, remove is false", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  let output = new Buffer([]);

  const stream = new streamPeekRemove(
    input,
    { bytes: 0, remove: false },
    (err, buffer) => {
      t.equals(buffer.length, 0, "peek buffer is empty");

      stream.on("data", chunk => (output = Buffer.concat([output, chunk])));
      stream.on("end", () => {
        t.equals(
          output.toString("utf8"),
          string,
          "resulting stream removes nothing"
        );
        t.end();
      });
    }
  );
});

tape("Equal bytes than actual stream length, default remove", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  let output = new Buffer([]);

  const stream = new streamPeekRemove(
    input,
    { bytes: string.length },
    (err, buffer) => {
      t.equals(
        buffer.length,
        string.length,
        "peek buffer length is equal to the input length"
      );
      t.equals(
        buffer.toString("utf8"),
        string,
        "peek buffer contains the whole stream data"
      );

      stream.on("data", chunk => (output = Buffer.concat([output, chunk])));
      stream.on("end", () => {
        t.equals(output.length, 0, "resulting stream is empty");
        t.end();
      });
    }
  );
});

tape("Equal bytes than actual stream length, remove is false", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  let output = new Buffer([]);

  const stream = new streamPeekRemove(
    input,
    { bytes: string.length, remove: false },
    (err, buffer) => {
      t.equals(
        buffer.length,
        string.length,
        "peek buffer length is equal to the input length"
      );
      t.equals(
        buffer.toString("utf8"),
        string,
        "peek buffer contains the whole stream data"
      );

      stream.on("data", chunk => (output = Buffer.concat([output, chunk])));
      stream.on("end", () => {
        t.equals(
          output.toString("utf8"),
          string,
          "resulting stream contains the whole stream data"
        );
        t.end();
      });
    }
  );
});

tape("More bytes than actual stream length, default remove", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  let output = new Buffer([]);

  const stream = new streamPeekRemove(
    input,
    { bytes: string.length + 10 },
    (err, buffer) => {
      t.equals(
        buffer.length,
        string.length,
        "peek buffer length is equal to the input length"
      );
      t.equals(
        buffer.toString("utf8"),
        string,
        "peek buffer contains the whole stream data"
      );

      stream.on("data", chunk => (output = Buffer.concat([output, chunk])));
      stream.on("end", () => {
        t.equals(output.length, 0, "resulting stream is empty");
        t.end();
      });
    }
  );
});

tape("More bytes than actual stream length, remove is false", t => {
  const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const input = readableStream(string);
  let output = new Buffer([]);

  const stream = new streamPeekRemove(
    input,
    { bytes: string.length + 10, remove: false },
    (err, buffer) => {
      t.equals(
        buffer.length,
        string.length,
        "peek buffer length is equal to the input length"
      );
      t.equals(
        buffer.toString("utf8"),
        string,
        "peek buffer contains the whole stream data"
      );

      stream.on("data", chunk => (output = Buffer.concat([output, chunk])));
      stream.on("end", () => {
        t.equals(
          output.toString("utf8"),
          string,
          "resulting stream contains the whole stream data"
        );
        t.end();
      });
    }
  );
});

tape("Big file, 100,000 bytes, default remove", t => {
  const original = fs.readFileSync(__dirname + "/test1");
  const input = fs.createReadStream(__dirname + "/test1");
  let output = new Buffer([]);

  const stream = new streamPeekRemove(
    input,
    { bytes: 100000 },
    (err, buffer) => {
      t.equals(
        buffer.length,
        100000,
        "peek buffer length is equal to the input length"
      );
      t.deepEqual(
        buffer,
        original.slice(0, 100000),
        "peek buffer contains the first 100000 bytes"
      );

      stream.on("data", chunk => (output = Buffer.concat([output, chunk])));
      stream.on("end", () => {
        t.equal(
          output.length,
          original.length - 100000,
          "length is the remaining bytes"
        );
        t.deepEqual(
          output,
          original.slice(100000),
          "resulting stream contains the remaining stream data"
        );
        input.close();
        t.end();
      });
    }
  );
});

tape("Big file, 100,000 bytes, remove is false", t => {
  const original = fs.readFileSync(__dirname + "/test1");
  const input = fs.createReadStream(__dirname + "/test1");
  let output = new Buffer([]);

  const stream = new streamPeekRemove(
    input,
    { bytes: 100000, remove: false },
    (err, buffer) => {
      t.equals(
        buffer.length,
        100000,
        "peek buffer length is equal to the input length"
      );
      t.deepEqual(
        buffer,
        original.slice(0, 100000),
        "peek buffer contains the first 100000 bytes"
      );

      stream.on("data", chunk => (output = Buffer.concat([output, chunk])));
      stream.on("end", () => {
        t.equal(output.length, original.length, "length is equal");
        t.deepEqual(
          output,
          original,
          "resulting stream contains the full stream data"
        );
        input.close();
        t.end();
      });
    }
  );
});
