"use strict";
let adminModel = require('../models/adminModel');

const getUserPrivilege = async (userID, privilege) => {
    let privileges = await adminModel.getUserPrivileges(userID) || {};

    return privileges[privilege];
};

const setDbState = async (userID, state) => {
    try {
        let hasRights = await getUserPrivilege(userID, "canSetDbState");

        if (!hasRights) {
            return {
                success: false,
                message: "You don't have the privileges required to perform this action."
            }
        }

        await adminModel.setDbState(state);
    } catch (err) {
        console.error(err);

        return {
            success: false,
            message: err.message,
            stack: err.stack
        }
    }

    return true;
};

module.exports = {
    setDbState
}