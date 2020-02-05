let userModel = require('../models/userModel');

exports.getUserPreferences = async function getUserPreferences(userID) {
    var targetUserData = {},
        availableUsers = []; // available for selection in the active room

    let preferences = await userModel.getUserPreferences(userID);
    let activeRoomID = (preferences.activeRoomData || {}).id;

    let targetUserID = (
            (preferences.rooms || []).find(r => r.isActive) || {}
        ).viewShiftsForUserID;
    
    if (activeRoomID !== undefined && targetUserID !== undefined) {
        targetUserDataPromise = userModel.getTargetUserData(userID, targetUserID, activeRoomID);
        availableUsersPromise = userModel.getUsersForRoom(userID, activeRoomID);

        [availableUsers, targetUserData] =
            await Promise.all([availableUsersPromise, targetUserDataPromise]);
    }

    console.log(availableUsers);
    preferences.rooms = preferences.rooms.map(r => {
        if (r.isActive) {
            return Object.assign(r, targetUserData, { availableUsers });
        }

        return r;
    })

    return preferences;
};