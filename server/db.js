const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
// const GcloudAdapter = require('./GcloudAdapter');

const adapter = new FileAsync('db.json');
// const adapter = new GcloudAdapter('db.json', {
//     projectId: "a-shift-calendar",
//     keyFilename: "./A Shift Calendar-c83d3128678d.json",
//     bucketName: "a-shift-calendar-db-eu-w6",
// })

const db = low(adapter);

db.then(db => {
    db.defaults({
        "users": [
          {
            "id": 1,
            "username": "alexander",
            "fullName": "Alexander",
            "password": "$2a$12$TbEVhB7w7cnujvA7PcwYl.zeEW5RPGqBLW4b820Nb4ddIMlSRub0.",
            "privileges": {
              "canSetDbState": true
            },
            "rooms": [
              {
                "roomID": 1,
                "isActive": true,
                "viewShiftsForUserID": 1,
              }
            ],
            "allowedShifts": [
              {
                "shiftName": "П",
                "order": 1
              },
              {
                "shiftName": "Ц",
                "order": 2
              },
              {
                "shiftName": "Ф",
                "order": 2
              }
            ]
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
          },
          {
            "id": 3,
            "username": "yoana",
            "fullName": "Yoana",
            "password": "$2a$12$TbEVhB7w7cnujvA7PcwYl.zeEW5RPGqBLW4b820Nb4ddIMlSRub0.",
            "rooms": [
              {
                "roomID": 1,
                "isActive": true,
                "viewShiftsForUserID": 2
              }
            ],
            "allowedShifts": []
          }
        ],
        "rooms": [
          {
            "id": 1,
            "name": "Room 1",
            "shiftData": [],
            "shiftTagClasses": {
              "Д": "is-primary",
              "Н": "is-info",
              "1": "is-warning",
              "2": "is-danger",
              "П": "is-success",
              "Ц": "is-danger"
            }
          }
        ],
        "sessions": []
      }).write();
});

module.exports = db;