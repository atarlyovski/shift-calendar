import React, { useContext } from 'react';

import { UserStoreContext } from '../mobx/userStore';

export const useShifts = (date) => {
    const userStore = useContext(UserStoreContext);

    if (!userStore.userShiftData) {
        return [];
    }
    
    let room = userStore
        .userShiftData
        .rooms
        .find(room => room.isActive);

    let dateString = date.toFormattedString();
    let targetUserID = room ? room.viewShiftsForUserID : null;

    if (targetUserID === null) {
        throw new Error("targetUserID is null");
    }

    let shiftData = userStore
        .userShiftData
        .activeRoomData
        .shiftData
        .find(shift =>
            shift.date === dateString &&
                shift.userID === targetUserID
        );
    
    shiftData = shiftData || {};

    return convertShiftsToHtml(shiftData.shifts);
}

const convertShiftsToHtml = (shifts) => {
    return (
        shifts ? <div className="tag">{shifts.join("+")}</div> : "-"
    )
}