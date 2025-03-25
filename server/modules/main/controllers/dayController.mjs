"use strict";
import dayModel from '../models/dayModel.mjs';
import userModel from '../models/userModel.mjs';

import { DbDate } from '../../../DbDate.mjs';

export async function setDayShifts(roomID, userID, date, shifts) {
    let isSuccessful = false;

    if (!(date instanceof DbDate)) {
        throw new Error("Invalid date (" + typeof(date) + ")")
    }
    
    if (await userModel.hasAccessToRoom(userID, roomID)) {
        isSuccessful = await dayModel.setShifts(roomID, userID, date, shifts)
    }

    return isSuccessful;
}