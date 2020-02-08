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

module.exports = {
    getUserPreferences,
    setTargetUserID
}