let userModel = require('../models/userModel');

exports.getUserPreferences = async function getUserPreferences(userID) {
    let preferences = await userModel.getUserPreferences(userID);
    return preferences;
};