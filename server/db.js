const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const adapter = new FileAsync('db.json');
const db = low(adapter);

db.then(db => {
    db.defaults({
        "users": [
          {
            "id": 1,
            "username": "alexander",
            "fullName": "Alexander",
            "password": "$2a$12$TbEVhB7w7cnujvA7PcwYl.zeEW5RPGqBLW4b820Nb4ddIMlSRub0.",
            "rooms": [
              {
                "roomID": 1,
                "isActive": true,
                "viewShiftsForUserID": 1,
                "availableUsers": [
                  {
                    "id": 1,
                    "fullName": "Alexander",
                    "isActive": false
                  },
                  {
                    "id": 2,
                    "fullName": "Rumyana",
                    "isActive": true
                  }
                ]
              }
            ],
            "allowedShifts": []
          },
          {
            "id": 2,
            "username": "rumyana",
            "fullName": "Rumyana",
            "password": "$2a$12$TbEVhB7w7cnujvA7PcwYl.zeEW5RPGqBLW4b820Nb4ddIMlSRub0.",
            "rooms": [
              {
                "roomID": 1,
                "isActive": true,
                "viewShiftsForUserID": 2
              }
            ],
            "allowedShifts": [
              {
                "shiftName": "Д",
                "order": 1
              },
              {
                "shiftName": "Н",
                "order": 15
              },
              {
                "shiftName": "1",
                "order": 2
              },
              {
                "shiftName": "2",
                "order": 5
              }
            ]
          }
        ],
        "rooms": [
          {
            "id": 1,
            "name": "Room 1",
            "shiftData": []
          }
        ]
      }).write();
});

module.exports = db;