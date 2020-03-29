"use strict";
var db = require('../../../db');

const getUserPrivileges = async userId => {
    let dbInstance = await db;

    let privileges = await dbInstance.get("users")
        .find({id: userId})
        .get("privileges")
        .value();

    return JSON.parse(JSON.stringify(privileges));
}

const setDbState = async state => {
    let dbInstance = await db;

    await dbInstance
        .setState(state)
        .write();
}

module.exports = {
    getUserPrivileges,
    setDbState
};