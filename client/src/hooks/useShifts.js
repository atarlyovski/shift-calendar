import React, { useContext } from 'react';

import { UserStoreContext } from '../mobx/userStore';

export const useShifts = (date, {format = "html"} = {}) => {
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

    let shiftTagClasses = userStore
        .userShiftData
        .activeRoomData
        .shiftTagClasses;

    return (format === "html") ?
        convertShiftsToHtml(shiftData.shifts || [], shiftTagClasses || {}) :
        (shiftData.shifts || []);
}

const convertShiftsToHtml = (shifts = [], shiftTagClasses = {}) => {
    let tags = shifts.map((shift, i) => {
        let classNames = shiftTagClasses[shift] || "";

        return <div className={"tag " + classNames} key={i}>{shift}</div>
    })

    return (
        (shifts && shifts.length > 0) ?
            <div className="tags has-addons">{tags}</div> :
            <div className="tags has-addons"><div className="tag" style={{visibility: "hidden"}}>-</div></div>
    )
}