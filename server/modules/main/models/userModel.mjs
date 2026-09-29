"use strict";
import argon2 from 'argon2';
import moment from 'moment';

import db from '../../../db.mjs';

async function hasAccessToRoom(userID, roomID) {
    let dbInstance = await db;

    let room = dbInstance
        .data
        .users
        .find(user => user.id === userID)
        ?.rooms
        .find(room => room.roomID === roomID);
    
    return room ? true : false;
}

function normalizeSyncRoomIDs(syncWithRooms = []) {
    return [...new Set(
        (Array.isArray(syncWithRooms) ? syncWithRooms : [])
            .map(value => parseInt(value, 10))
            .filter(value => !Number.isNaN(value))
    )];
}

async function syncUserRoomData(userID, roomID1, roomID2) {
    let dbInstance = await db;

    await dbInstance.update(data => {
        const roomA = data.rooms.find(room => room.id === roomID1);
        const roomB = data.rooms.find(room => room.id === roomID2);

        if (!roomA || !roomB) {
            return;
        }

        const entriesByDate = {};

        [...(roomA.shiftData || []), ...(roomB.shiftData || [])]
            .filter(entry => entry.userID === userID)
            .forEach(entry => {
                entriesByDate[entry.date] = {
                    date: entry.date,
                    userID,
                    shifts: [...(entry.shifts || [])]
                };
            });

        roomA.shiftData = (roomA.shiftData || []).filter(entry => entry.userID !== userID);
        roomB.shiftData = (roomB.shiftData || []).filter(entry => entry.userID !== userID);

        Object.values(entriesByDate).forEach(entry => {
            roomA.shiftData.push(entry);
            roomB.shiftData.push({
                date: entry.date,
                userID,
                shifts: [...entry.shifts]
            });
        });
    });
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
    const dbInstance = await db;

    let user = dbInstance
        .data
        .users
        .find(user => user.id === userID);

    let rooms = (user?.rooms || []).map(room => {
        const roomData = dbInstance
            .data
            .rooms
            .find(r => r.id === room.roomID);

        return {
            ...room,
            name: roomData?.name || null,
            syncWithRooms: normalizeSyncRoomIDs(room.syncWithRooms)
        };
    });

    let activeRoom = rooms.find(r => r.isActive) || rooms[0] || null;
    let roomID = activeRoom ? activeRoom.roomID : null;

    let activeRoomData = null;

    if (roomID !== null) {
        activeRoomData = JSON.parse(
            JSON.stringify(
                dbInstance
                    .data
                    .rooms
                    .find(room => room.id === roomID)
            )
        );

        if (activeRoomData) {
            delete activeRoomData.password;
        }
    }

    let preferences = JSON.parse(JSON.stringify({rooms, activeRoomData}));

    return preferences;
}

async function setActiveRoom(userID, roomID) {
    let dbInstance = await db;

    await dbInstance.update(data => {
        let user = data.users.find(user => user.id === userID);

        if (!user || !user.rooms) {
            return;
        }

        user.rooms.forEach(room => {
            room.isActive = room.roomID === roomID;
        });
    });
}

async function getSyncedRoomIDs(userID, roomID) {
    let dbInstance = await db;

    let user = dbInstance
        .data
        .users
        .find(user => user.id === userID);

    let room = user?.rooms?.find(room => room.roomID === roomID);

    return normalizeSyncRoomIDs(room?.syncWithRooms || []);
}

async function setRoomSync(userID, roomID1, roomID2, isSynced) {
    let dbInstance = await db;

    await dbInstance.update(data => {
        let user = data.users.find(user => user.id === userID);

        if (!user || !user.rooms) {
            return;
        }

        const toggleSync = (roomID, linkedRoomID) => {
            const room = user.rooms.find(room => room.roomID === roomID);

            if (!room) {
                return;
            }

            room.syncWithRooms = normalizeSyncRoomIDs(room.syncWithRooms || []);

            if (isSynced) {
                if (!room.syncWithRooms.includes(linkedRoomID)) {
                    room.syncWithRooms.push(linkedRoomID);
                }
            } else {
                room.syncWithRooms = room.syncWithRooms.filter(id => id !== linkedRoomID);
            }
        };

        toggleSync(roomID1, roomID2);
        toggleSync(roomID2, roomID1);
    });

    if (isSynced) {
        await syncUserRoomData(userID, roomID1, roomID2);
    }
}

async function getUsersForRoom(userID, targetUserID, roomID) {
    var dbInstance;

    dbInstance = await db;

    // Make sure the user has access to the room
    let room = dbInstance
        .data
        .users
        .find(user => user.id === userID)
        ?.rooms
        .find(room => room.roomID === roomID);

    if (!room) {
        return {};
    }

    let roomUsers = dbInstance
        .data
        .users
        .filter(user =>
            user.rooms.find(room =>
                room.roomID === roomID)
        );
    
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
        .update(data => {
            let user = data.users.find(user => user.id === userID);
            let room = user.rooms.find(room => room.roomID === roomID);
            room.viewShiftsForUserID = targetUserID;
        });
}

function fetchUserByID(userID) {
    return new Promise(async (resolve, reject) => {
        var user;
        var dbInstance = await db;

        user = dbInstance
            .data
            .users
            .find(user => user.id === userID);

        resolve(user);
    });
}

function fetchUserByUsername(username) {
    return new Promise(async (resolve, reject) => {
        var user;
        var dbInstance = await db;

        user = dbInstance
            .data
            .users
            .find(user => user.username === username);

        resolve(user);
    });
}

async function getHashedPasswordForUser(username) {
    var user,
        dbInstance;

        dbInstance = await db;

        user = dbInstance
            .data
            .users
            .find(user => user.username === username);

    if (!user) {
        return {found: false};
    }

    return {found: true, password: user.password};
}

async function logOutUser(userID) {
    var dbInstance;

    dbInstance = await db;

    await dbInstance
        .update(data => {
            data.sessions = data.sessions.filter(({sess}) => {
                return (sess.passport || {}).user !== userID;
            });
        });
}

async function setPasswordForUser(userID, hash) {
    var dbInstance;

    dbInstance = await db;

    await dbInstance
        .update(data => {
            let user = data.users.find(user => user.id === userID);
            user.password = hash;
        });
}

async function deleteShiftsOlderThan(dateMs, dbDateFormat = "YYYY-M-D") {
    var dbInstance;

    dbInstance = await db;

    await dbInstance
        .update(data => {
            data.rooms = data.rooms.map(room => {
                room.shiftData = room.shiftData?.filter(shift => moment(shift.date, dbDateFormat).isAfter(dateMs));
                return room;
            });
        });
}

async function addUnsuccessfulLoginAttempt(username) {
    var dbInstance;

    dbInstance = await db;

    let unsuccessfulLoginAttempts = dbInstance
        .data
        .unsuccessfulLoginAttempts[username];

    if (!unsuccessfulLoginAttempts) {
        unsuccessfulLoginAttempts = [];
    }

    unsuccessfulLoginAttempts.push(moment().valueOf());

    await dbInstance
        .update(data => {
            data.unsuccessfulLoginAttempts[username] = unsuccessfulLoginAttempts;
        });
}

async function getUnsuccessfulLoginAttempts(username, startDateMs) {
    var dbInstance;

    dbInstance = await db;

    let unsuccessfulLoginAttempts = dbInstance
        .data
        .unsuccessfulLoginAttempts[username];

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

    let usernames = Object.keys(dbInstance
        .data
        .unsuccessfulLoginAttempts
    );
    
    let startDate = startDateMs || moment().subtract(1, 'day').valueOf();
    let count = 0;

    for (let i = 0; i < usernames.length; i++) {
        let unsuccessfulLoginAttempts = dbInstance
            .data
            .unsuccessfulLoginAttempts[usernames[i]];
        
        count += unsuccessfulLoginAttempts.filter(date => date > startDate).length;
    }

    return count;
}

async function deleteUnsuccessfulLoginAttemptsOlderThan(dateMs) {
    var dbInstance;

    dbInstance = await db;

    let usernames = Object.keys(dbInstance
        .data
        .unsuccessfulLoginAttempts
    );

    for (let i = 0; i < usernames.length; i++) {
        let unsuccessfulLoginAttempts = dbInstance
            .data
            .unsuccessfulLoginAttempts[usernames[i]];
        
        let newUnsuccessfulLoginAttempts = unsuccessfulLoginAttempts.filter(date => date > dateMs);

        await dbInstance
            .update(data => {
                if (newUnsuccessfulLoginAttempts.length === 0) {
                    delete data.unsuccessfulLoginAttempts[usernames[i]];
                    return;
                }

                data.unsuccessfulLoginAttempts[usernames[i]] = newUnsuccessfulLoginAttempts;
            });
    }
}

async function deleteExpiredSessions() {
    var dbInstance;

    dbInstance = await db;

    await dbInstance
        .update(data => {
            data.sessions = data.sessions.filter(({ sess }) => {
                return sess && sess._expire && moment(sess._expire).isAfter(moment());
            });
        });
}

async function setIsHome(userID, isHome) {
    var dbInstance;
    const now = new Date().getTime();
    let lastSeenHome;

    dbInstance = await db;

    if (!isHome) {
        lastSeenHome = dbInstance
            .data
            .users
            .find(user => user.id === userID)
            ?.isHomeData?.lastSeenHome || null;
    }
    else {
        lastSeenHome = now;
    }

    dbInstance
        .update(data => {
            let user = data.users.find(user => user.id === userID);

            user.isHomeData = {
                isHome,
                lastCheck: now,
                lastSeenHome
            };
        });
}

export default {
    hasAccessToRoom,
    authenticateUser,
    getUserPreferences,
    getUsersForRoom,
    fetchUserByID,
    setTargetUserID,
    setActiveRoom,
    getSyncedRoomIDs,
    logOutUser,
    setRoomSync,
    setPasswordForUser,
    deleteShiftsOlderThan,
    addUnsuccessfulLoginAttempt,
    getUnsuccessfulLoginAttempts,
    getTotalNumberOfUnsuccessfulAttempts,
    deleteUnsuccessfulLoginAttemptsOlderThan,
    deleteExpiredSessions,
    setIsHome
};