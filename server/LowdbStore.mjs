import db from './db.mjs';

export default class LowdbStore {
    constructor(dbPath = "sessions") {
        this.dbPath = dbPath;
    }

    async get(key) {
        let dbInstance = await db;

        let session = await dbInstance
            .data[this.dbPath]
            .find(s => s._id === key)?.sess;

        return session;
    }

    async set(sid, sess, ttl) {
        let dbInstance = await db;

        await this.destroy(sid);

        await dbInstance.update(data => {
            data[this.dbPath].push({_id: sid, sess, ttl});
        });
    }

    async destroy(sid) {
        let dbInstance = await db;

        await dbInstance.update(data => {
            data[this.dbPath] = data[this.dbPath].filter(s => s._id !== sid);
        });
    }
}