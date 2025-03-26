"use strict";
import db from '../../../db.mjs';

async function getShifts(roomID, forUserID, dates) {
    let dbInstance = await db;

    dates = dates.map(date => date.toFormattedString());

    let shifts = dbInstance
        .data
        .rooms
        .find(room => room.id === roomID)
        .shifts
        .filter(shift => dates.includes(shift.date) && shift.userID === forUserID);

    return shifts;
}

async function setShifts(roomID, userID, date, shifts) {
    let dbInstance = await db;

    await dbInstance.update(data => {
        let room = data.rooms.find(room => room.id === roomID);
        let shiftDataIndex = room.shiftData.findIndex(
            s => s.date === date.toFormattedString() && s.userID === userID
        );

        if (shiftDataIndex === -1) {
            room.shiftData.push({
                date: date.toFormattedString(),
                userID: userID,
                shifts: shifts
            });
        } else {
            room.shiftData[shiftDataIndex].shifts = shifts;
        }
    });

    return true;
}

export default {
    getShifts,
    setShifts
};