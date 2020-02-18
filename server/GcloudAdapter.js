const Storage = require('@google-cloud/storage').Storage;

class GcloudAdapter {
  constructor(
    source = 'db.json',
    {
      defaultValue = {},
      serialize = JSON.stringify,
      deserialize = JSON.parse,
      projectId,
      keyFilename,
      bucketName,
    } = {},
  ) {
    this.source = source;
    this.defaultValue = defaultValue;
    this.serialize = serialize;
    this.deserialize = deserialize;
    this.bucketName = bucketName;

    // Creates a client
    this.storage = new Storage({
      projectId,
      keyFilename,
    });
    this.bucket = this.storage.bucket(this.bucketName);
    this.file = this.bucket.file(this.source);
  }

  async read() {
    return new Promise((resolve, reject) => {
      this.file.download().then((data) => {
        const file = data[0];
        const contents = this.deserialize(file);
        resolve(contents);
      }).catch((err) => {
        if (err.code === 404) {
          this.write(this.defaultValue)
            .then(() => resolve(this.defaultValue))
            .catch(reject);
        } else {
          reject(err);
        }
      });
    });
  }

  async write(data) {
    const contents = this.serialize(data);

    return this.file.save(contents, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      resumable: false,
      metadata: {
        contentType: 'application/json',
        cacheControl: 'no-cache',
      },
    });
  }
}

module.exports = GcloudAdapter;