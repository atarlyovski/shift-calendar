"use strict";
const db = require('../../../db')

exports.getShifts = async function getShifts(roomID, forUserID, dates) {
    let dbInstance = await db;

    dates = dates.map(date => date.toFormattedString());

    let shifts = await dbInstance.get("rooms")
        .find({id: roomID})
        .get("shifts")
        .filter(shift => dates.includes(shift.date))
        .filter({userID: forUserID});

    return shifts;
}

exports.setShifts = async function setShifts(roomID, userID, date, shifts) {
    let dbInstance = await db;

    await dbInstance.get("rooms")
        .find({id: roomID})
        .get("shifts")
        .remove({
            date: date.toFormattedString(),
            userID: userID
        })
        .write();
    
    await dbInstance.get("rooms")
        .find({id: roomID})
        .get("shifts")
        .push({
            date: date.toFormattedString(),
            userID: userID,
            shifts: shifts
        })
        .write();
}