let userModel = require('../models/userModel');

exports.getUserPreferences = async function getUserPreferences(userID) {
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