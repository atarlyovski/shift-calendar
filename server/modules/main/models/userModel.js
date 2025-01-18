"use strict";
const argon2 = require('argon2');
const moment = require('moment');

const db = require('../../../db');

async function hasAccessToRoom(userID, roomID) {
    let dbInstance = await db;

    let room = await dbInstance
        .get("users")
        .find({id: userID})
        .get("rooms")
        .find({roomID: roomID})
        .value();
    
    return room ? true : false;
}

/**
 * Authenticates a user by checking if the username and password match.
 * The password is compared against the hash stored in the DB.
 * @param {String} username
 * @param {String} password - The plain text password provided by the user.
 * @returns {Promise} - The promise is resolved with the user object if
 *   the password matches or with the value of false which indicates
 *   to the passport middleware that the authentication was unsuccessful.
 */
function authenticateUser(username, password) {
    return new Promise(async (resolve, reject) => {
        let isOK = false,
            user;

        if (typeof username !== "string" || !username) {
            return reject(new Error("The username must be a non-empty string!"));
        }

        if (typeof password !== "string" || !password) {
            return reject(new Error("The passwrod must be a non-empty string!"));
        }

        try {
            let userData = await getHashedPasswordForUser(username);
            
            if (userData.found) {
                isOK = await argon2.verify(userData.password, password);
            }

            if (isOK) {
                user = await fetchUserByUsername(username);
            }
        } catch (err) {
            return reject(err);
        }

        resolve(isOK ? user : false);
    });
};

async function getUserPreferences(userID) {
    var dbInstance;

    dbInstance = await db;

    let rooms = await dbInstance.get("users")
        .find({id: userID})
        .get("rooms")
        .value();
    
    let activeRoom = rooms.find(r => r.isActive);
    let roomID = activeRoom ? activeRoom.roomID : null;
    
    let activeRoomData = JSON.parse(
        JSON.stringify(
            await dbInstance.get("rooms")
            .find({id: roomID})
            .value()
        )
    );
    
    // Delete the password from the cloned object, not from the DB itself:
    delete activeRoomData.password;

    // Deep clone so we don't push activeRoomData to the DB:
    let preferences = JSON.parse(JSON.stringify({rooms, activeRoomData}));

    return preferences;
}

async function getUsersForRoom(userID, targetUserID, roomID) {
    var dbInstance;

    dbInstance = await db;

    // Make sure the user has access to the room
    let room = await dbInstance
        .get("users")
        .find({id: userID})
        .get("rooms")
        .find({roomID})
        .value();

    if (!room) {
        return {};
    }

    let roomUsers = await dbInstance
        .get("users")
        .filter(user =>
            user.rooms.find(room =>
                room.roomID === roomID)
        )
        .value();
    
    roomUsers = roomUsers.map(user => {
        return {
            id: user.id,
            fullName: user.fullName,
            isActive: user.id === targetUserID,
            isHomeData: user.isHomeData
        }
    });

    return roomUsers;
}

async function setTargetUserID(userID, roomID, targetUserID) {
    let dbInstance = await db;

    await dbInstance
        .get('users')
        .find({id: userID})
        .get('rooms')
        .find({roomID})
        .set('viewShiftsForUserID', targetUserID)
        .write();
}

function fetchUserByID(userID) {
    return new Promise(async (resolve, reject) => {
        var user;

        try {
            user = fetchUser({id: userID});
        } catch (error) {
            return reject(err);
        }

        resolve(user);
    });
}

function fetchUserByUsername(username) {
    return new Promise(async (resolve, reject) => {
        var user;

        try {
            user = fetchUser({username: username});
        } catch (error) {
            return reject(err);
        }

        resolve(user);
    });
}

async function fetchUser(filter) {
    var user,
        dbInstance;

    dbInstance = await db;

    user = await dbInstance.get("users")
        .filter(filter)
        .value();

    if (!user || !user[0]) {
        resolve(false);
    }

    return user[0];
}

async function getHashedPasswordForUser(username) {
    var user,
        dbInstance;

        dbInstance = await db;

        user = await dbInstance.get("users")
            .filter({username: username})
            .value();

    if (!user || !user[0]) {
        return {found: false};
    }

    return {found: true, password: user[0].password};
}

async function logOutUser(userID) {
    var dbInstance;

    dbInstance = await db;

    await dbInstance
        .get("sessions")
        .remove(({sess}) => {return (sess.passport || {}).user === userID})
        .write();
}

async function setPasswordForUser(userID, hash) {
    var dbInstance;

    dbInstance = await db;

    await dbInstance
        .get("users")
        .find({id: userID})
        .set("password", hash)
        .write();
}

async function deleteShiftsOlderThan(dateMs, dbDateFormat = "YYYY-M-D") {
    var dbInstance;

    dbInstance = await db;

    let rooms = await dbInstance
        .get("rooms")
        .value();
    
    for (let i = 0; i < rooms.length; i++) {
        await dbInstance
            .get(`rooms[${i}].shiftData`)
            .remove(({date}) => {
                return moment(date, dbDateFormat).isBefore(dateMs)
            })
            .write();
    }
}

async function addUnsuccessfulLoginAttempt(username) {
    var dbInstance;

    dbInstance = await db;

    let unsuccessfulLoginAttempts = await dbInstance
        .get("unsuccessfulLoginAttempts")
        .get(username)
        .value();

    if (!unsuccessfulLoginAttempts) {
        unsuccessfulLoginAttempts = [];
    }

    unsuccessfulLoginAttempts.push(moment().valueOf());

    await dbInstance
        .get("unsuccessfulLoginAttempts")
        .set(username, unsuccessfulLoginAttempts)
        .write();
}

async function getUnsuccessfulLoginAttempts(username, startDateMs) {
    var dbInstance;

    dbInstance = await db;

    let unsuccessfulLoginAttempts = await dbInstance
        .get("unsuccessfulLoginAttempts")
        .get(username)
        .value();

    if (!unsuccessfulLoginAttempts) {
        return 0;
    }

    let startDate = startDateMs || moment().subtract(1, 'day').valueOf();
    let count = unsuccessfulLoginAttempts.filter(date => date > startDate).length;

    return count;
}

async function getTotalNumberOfUnsuccessfulAttempts(startDateMs) {
    var dbInstance;

    dbInstance = await db;

    let usernames = await dbInstance
        .get("unsuccessfulLoginAttempts")
        .keys()
        .value();
    
    let startDate = startDateMs || moment().subtract(1, 'day').valueOf();
    let count = 0;

    for (let i = 0; i < usernames.length; i++) {
        let unsuccessfulLoginAttempts = await dbInstance
            .get("unsuccessfulLoginAttempts")
            .get(usernames[i])
            .value();
        
        count += unsuccessfulLoginAttempts.filter(date => date > startDate).length;
    }

    return count;
}

async function deleteUnsuccessfulLoginAttemptsOlderThan(dateMs) {
    var dbInstance;

    dbInstance = await db;

    let usernames = await dbInstance
        .get("unsuccessfulLoginAttempts")
        .keys()
        .value();

    for (let i = 0; i < usernames.length; i++) {
        let unsuccessfulLoginAttempts = await dbInstance
            .get("unsuccessfulLoginAttempts")
            .get(usernames[i])
            .value();
        
        let newUnsuccessfulLoginAttempts = unsuccessfulLoginAttempts.filter(date => date > dateMs);

        if (newUnsuccessfulLoginAttempts.length === 0) {
            await dbInstance
                .get("unsuccessfulLoginAttempts")
                .unset(usernames[i])
                .write();
        } else {
            await dbInstance
                .get("unsuccessfulLoginAttempts")
                .set(usernames[i], newUnsuccessfulLoginAttempts)
                .write();
        }
    }
}

async function deleteExpiredSessions() {
    var dbInstance;

    dbInstance = await db;

    let sessions = await dbInstance
        .get("sessions")
        .value();

    let validSessions = sessions
        .filter(({sess}) => {
            let expires = sess._expire;
            return expires && moment(expires).isAfter(moment());
        });

    await dbInstance
        .set("sessions", validSessions)
        .write();
}

async function setIsHome(userID, isHome) {
    var dbInstance;
    const now = new Date().getTime();

    dbInstance = await db;

    await dbInstance
        .get("users")
        .find({id: userID})
        .set("isHomeData", {isHome, lastCheck: now})
        .write();
}

module.exports = {
    hasAccessToRoom,
    authenticateUser,
    getUserPreferences,
    getUsersForRoom,
    fetchUserByID,
    setTargetUserID,
    logOutUser,
    setPasswordForUser,
    deleteShiftsOlderThan,
    addUnsuccessfulLoginAttempt,
    getUnsuccessfulLoginAttempts,
    getTotalNumberOfUnsuccessfulAttempts,
    deleteUnsuccessfulLoginAttemptsOlderThan,
    deleteExpiredSessions,
    setIsHome
}