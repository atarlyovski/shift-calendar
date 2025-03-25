"use strict";
import adminModel from '../models/adminModel.mjs';

const getUserPrivilege = async (userID, privilege) => {
    let privileges = await adminModel.getUserPrivileges(userID) || {};

    return privileges[privilege];
};

const getDbState = async userID => {
    try {
        let hasRights = await getUserPrivilege(userID, "canSetDbState");

        if (!hasRights) {
            return {
                status: 403,
                message: "You don't have the privileges required to perform this action."
            }
        }

        let dbState = await adminModel.getDbState();

        return {
            status: 200,
            dbState
        }
    } catch (err) {
        console.error(err);

        return {
            status: 500,
            message: err.message,
            stack: err.stack
        }
    }
};

const setDbState = async (userID, state) => {
    try {
        let hasRights = await getUserPrivilege(userID, "canSetDbState");

        if (!hasRights) {
            return {
                status: 500,
                message: "You don't have the privileges required to perform this action."
            }
        }

        await adminModel.setDbState(state);
    } catch (err) {
        console.error(err);

        return {
            status: 500,
            message: err.message,
            stack: err.stack
        }
    }

    return {status: 204};
};

export default {
    getDbState,
    setDbState
};