const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const adapter = new FileAsync('db.json');
const db = low(adapter);

db.then(db => {
    db.defaults({
        users: [
            {
                id: 1,
                username: "alexander",
                fullName: "Alexander Tarlyovski",
                password: "$2a$12$TbEVhB7w7cnujvA7PcwYl.zeEW5RPGqBLW4b820Nb4ddIMlSRub0.",
                roomIDs: [1]
            }
        ],
        rooms: [
            {
                id: 1,
                name: "Room 1",
                password: "$2a$12$TbEVhB7w7cnujvA7PcwYl.zeEW5RPGqBLW4b820Nb4ddIMlSRub0.",
                shifts: []
            }
        ],
        sessions: []
    }).write();
});

module.exports = db;