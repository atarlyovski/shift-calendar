"use strict";
const bcrypt = require('bcrypt');
const db = require('../../../db');

exports.hasAccessToRoom = async function hasAccessToRoom(userID, roomID) {
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
 * The password is compared against the bcrypt hash stored in the DB.
 * @param {String} username
 * @param {String} password - The plain text password provided by the user.
 * @returns {Promise} - The promise is resolved with the user object if
 *   the password matches or with the value of false which indicates
 *   to the passport middleware that the authentication was unsuccessful.
 */
exports.authenticateUser = function authenticateUser(username, password) {
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
                isOK = await bcrypt.compare(password, userData.password);
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

exports.getUserPreferences = async function getUserPreferences(userID) {
    var dbInstance;

    dbInstance = await db;

    let rooms = await dbInstance.get("users")
        .find({id: userID})
        .get("rooms")
        .value();
    
    let activeRoom = rooms.find(r => r.isActive);
    let roomID = activeRoom ? activeRoom.roomID : null;
    
    let activeRoomData = await dbInstance.get("rooms")
        .find({id: roomID})
        .value();
    
    delete activeRoomData.password;

    return {
        rooms,
        activeRoomData
    };
}

exports.getTargetUserData = async function getTargetUserData(userID, targetUserID, roomID) {
    var dbInstance;

    dbInstance = await db;

    let room = await dbInstance
        .get("users")
        .find({id: userID})
        .get("rooms")
        .find({roomID})
        .value();

    if (!room) {
        return {};
    }

    let targetUserRoom = await dbInstance
        .get("users")
        .find({id: targetUserID})
        .get("rooms")
        .find({roomID})
        .value();
    
    if (!targetUserRoom) {
        return {};
    }

    let targetUserFullName = await dbInstance
        .get("users")
        .find({id: targetUserID})
        .get("fullName");

    return {
        targetUserFullName
    };
}

exports.fetchUserByID = fetchUserByID;

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