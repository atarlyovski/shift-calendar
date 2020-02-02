"use strict";
let dayModel = require('../models/dayModel')
let userModel = require('../models/userModel')

let DbDate = require('../../../DbDate').DbDate;

/*exports.getDayShifts = async function getDayShifts(date, userID, roomID, forUserID) {
    let shifts;

    if (!(date instanceof DbDate)) {
        throw new Error("Invalid date (" + typeof(date) + ")")
    }

    if (await userModel.hasAccessToRoom(userID, roomID)) {
        await dayModel.getShifts(roomID, forUserID, dates)
    }

    return shifts;
}*/

exports.setDayShifts = async function setDayShifts(roomID, userID, date, shifts) {
    let isSuccessful = false;

    if (!(date instanceof DbDate)) {
        throw new Error("Invalid date (" + typeof(date) + ")")
    }
    
    if (await userModel.hasAccessToRoom(userID, roomID)) {
        isSuccessful = await dayModel.setShifts(roomID, userID, date, shifts)
    }

    return isSuccessful;
}