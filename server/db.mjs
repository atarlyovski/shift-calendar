import { JSONFilePreset } from 'lowdb/node';
// import GcloudAdapter from './GcloudAdapter';

// const adapter = new GcloudAdapter('db.json', {
//     projectId: "a-shift-calendar",
//     keyFilename: "./A Shift Calendar-c83d3128678d.json",
//     bucketName: "a-shift-calendar-db-eu-w6",
// })

const defaultData = {
  "users": [
    {
      "id": 1,
      "username": "alexander",
      "fullName": "Alexander",
      "password": "$argon2id$v=19$m=65536,t=4,p=4$2lPo6lihfkMj7uTCFA2XUg$9TUWPQMP72TbBfyj+ffk5TuPXjdFScEU13BacSbZds4",
      "privileges": {
        "canSetDbState": true
      },
      "isHomeData": {
        "isHome": true,
        "lastCheck": 1734637237293
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
      "password": "$argon2id$v=19$m=65536,t=4,p=4$2lPo6lihfkMj7uTCFA2XUg$9TUWPQMP72TbBfyj+ffk5TuPXjdFScEU13BacSbZds4",
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
      "password": "$argon2id$v=19$m=65536,t=4,p=4$2lPo6lihfkMj7uTCFA2XUg$9TUWPQMP72TbBfyj+ffk5TuPXjdFScEU13BacSbZds4",
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
  "sessions": [],
  "unsuccessfulLoginAttempts": {
    "alexander": [
      1734637237293
    ]
  },
};

const db = await JSONFilePreset('db.json', defaultData)

export default db;