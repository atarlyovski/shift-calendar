"use strict";
import db from '../../../db.mjs';

const getUserPrivileges = async userId => {
    let dbInstance = await db;

    let privileges = await dbInstance
        .data
        .users
        .find(user => user.id === userId)
        ?.privileges;

    return JSON.parse(JSON.stringify(privileges));
}

const getDbState = async () => {
    let dbInstance = await db;
    let state = dbInstance.data;

    return state;
}

const setDbState = async state => {
    let dbInstance = await db;

    await dbInstance.update(() => state);
}

export default {
    getUserPrivileges,
    getDbState,
    setDbState
};