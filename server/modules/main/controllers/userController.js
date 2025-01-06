const argon2 = require('argon2');
const moment = require('moment');
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
    const minLength = 8;

    if (newPassword.length < minLength) {
        return {changed: false, cause: "passwordTooShort"};
    }

    const hasLowercase = /[a-z]/.test(newPassword);
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (hasLowercase + hasUppercase + hasNumber + hasSpecial < 3) {
        return {changed: false, cause: "passwordTooWeak"};
    }

    let isOK = await argon2.verify(oldHash, oldPassword);

    if (!isOK) {
        return {changed: false, cause: "invalidPasswordCombo"};
    }

    let newHash = await argon2.hash(newPassword, {
        memoryCost: 2 ** 16,
        timeCost: 4,
        parallelism: 4
    });

    let promises = [
        userModel.logOutUser(userID),
        userModel.setPasswordForUser(userID, newHash)
    ];

    await Promise.all(promises);

    return {changed: true};
}

async function addUnsuccessfulLoginAttempt(username) {
    return userModel.addUnsuccessfulLoginAttempt(username);
}

async function hasTooManyUnsuccessfulLoginAttempts(username) {
    const maxAllowedAttempts = 5;
    const startDate = moment().subtract(1, 'day').valueOf();
    const unsuccessfulLoginAttempts = await userModel.getUnsuccessfulLoginAttempts(username, startDate);

    if (unsuccessfulLoginAttempts === maxAllowedAttempts) {
        displayError(`User ${username} has too many unsuccessful login attempts!`);
    }

    return unsuccessfulLoginAttempts >= maxAllowedAttempts;
}

async function isAcessBlockedByUnsuccessfulAttempts() {
    const totalAllowedAttempts = 100;
    const startDate = moment().subtract(1, 'day').valueOf();
    const totalAttempts = await userModel.getTotalNumberOfUnsuccessfulAttempts(startDate);

    if (totalAttempts > totalAllowedAttempts) {
        displayError(`Too many unsuccessful login attempts!`);
        return true;
    }

    return false;
}

module.exports = {
    getUserPreferences,
    setTargetUserID,
    changePassword,
    addUnsuccessfulLoginAttempt,
    hasTooManyUnsuccessfulLoginAttempts,
    isAcessBlockedByUnsuccessfulAttempts
}