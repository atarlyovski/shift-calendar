let userModel = require('../models/userModel');

exports.getUserPreferences = async function getUserPreferences(userID) {
    var targetUserData = {};

    let preferences = await userModel.getUserPreferences(userID);
    let activeRoomID = (preferences.activeRoomData || {}).id;

    let targetUserID = (
            (preferences.rooms || []).find(r => r.isActive) || {}
        ).viewShiftsForUserID;
    
    if (activeRoomID !== undefined && targetUserID !== undefined) {
        targetUserData = await userModel.getTargetUserData(userID, targetUserID, activeRoomID);
    }

    preferences.rooms = preferences.rooms.map(r => {
        if (r.isActive) {
            return Object.assign(r, targetUserData);
        }

        return r;
    })

    return preferences;
};