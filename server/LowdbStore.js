var db = require('./db');

module.exports = class LowdbStore {
    constructor(dbPath = "sessions") {
        this.dbPath = dbPath;
    }

    async get(key) {
        let dbInstance = await db;

        let session = await dbInstance
            .get(this.dbPath)
            .find({_id: key})
            .get("sess")
            .value();

        return session;
    }

    async set(sid, sess, ttl) {
        let dbInstance = await db;

        await this.destroy(sid);

        await dbInstance
            .get(this.dbPath)
            .push({_id: sid, sess, ttl})
            .write();
    }

    async destroy(sid) {
        let dbInstance = await db;

        await dbInstance
            .get(this.dbPath)
            .remove({_id: sid})
            .write();
    }
}