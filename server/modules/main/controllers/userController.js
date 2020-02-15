const bcrypt = require('bcrypt');
const saltRounds = 12;

let userModel = require('../models/userModel');

async function getUserPreferences(userID) {
    var availableUsers = []; // available for selection in the active room

    let preferences = await userModel.getUserPreferences(userID);
    let activeRoomID = (preferences.activeRoomData || {}).id;

    let targetUserID = (
            (preferences.rooms || []).find(r => r.isActive) || {}
        ).viewShiftsForUserID;
    
    if (activeRoomID !== undefined && targetUserID !== undefined) {
        // targetUserDataPromise = userModel.getTargetUserData(userID, targetUserID, activeRoomID);
        availableUsers = await userModel.getUsersForRoom(userID, targetUserID, activeRoomID);
    }

    preferences.rooms = preferences.rooms.map(r => {
        if (r.isActive) {
            return Object.assign(r, { availableUsers });
        }

        return r;
    })

    return preferences;
};

async function setTargetUserID(userID, roomID, targetUserID) {
    if (await userModel.hasAccessToRoom(userID, roomID) === false) {
        throw new Error(`User ID = ${userID} has no access to roomID = ${roomID}`);
    }

    await userModel.setTargetUserID(userID, roomID, targetUserID);
    let preferences = await getUserPreferences(userID);

    return preferences;
};

async function changePassword(userID, oldPassword, oldHash, newPassword) {
    let isOK = await bcrypt.compare(oldPassword, oldHash);

    if (!isOK) {
        return {changed: false, cause: "wrong password"};
    }

    let salt = await bcrypt.genSalt(saltRounds);
    let newHash = await bcrypt.hash(newPassword, salt);

    let promises = [
        userModel.logOutUser(userID),
        userModel.setPasswordForUser(userID, newHash)
    ];

    await Promise.all(promises);

    return {changed: true};
}

module.exports = {
    getUserPreferences,
    setTargetUserID,
    changePassword
}