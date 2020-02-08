const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const adapter = new FileAsync('db.json');
const db = low(adapter);

db.then(db => {
    db.defaults({
        "users": [{
            "id": 1,
            "username": "alexander",
            "fullName": "Alexander Tarlyovski",
            "password": "$2a$12$TbEVhB7w7cnujvA7PcwYl.zeEW5RPGqBLW4b820Nb4ddIMlSRub0.",
            "rooms": [{
                "roomID": 1,
                "isActive": true,
                "viewShiftsForUserID": 1
            }],
            "activeRoomID": 1,
            "allowedShifts": [
                "Д",
                "Н",
                "1",
                "2"
            ]
        }],
        "rooms": [{
            "id": 1,
            "name": "Room 101",
            "password": "$2a$12$TbEVhB7w7cnujvA7PcwYl.zeEW5RPGqBLW4b820Nb4ddIMlSRub0.",
            "shiftData": [{
                    "userID": 1,
                    "date": "2020-1-29",
                    "shifts": [
                        "Д"
                    ]
                },
                {
                    "userID": 1,
                    "date": "2020-2-1",
                    "shifts": [
                        "Д",
                        "Н"
                    ]
                },
                {
                    "userID": 1,
                    "date": "2020-2-5",
                    "shifts": [
                        "1"
                    ]
                }
            ]
        }]
    }).write();
});

module.exports = db;