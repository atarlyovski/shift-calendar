import React, { useContext } from 'react';
import moment from '../../../moment-with-locales.custom';
import CustomDate from '../../../CustomDate';
import NextDaysElement from './NextDaysElement';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../../../mobx/userStore';

const NextDays = observer(() => {
    const dateSpan = {from: -1, to: 4};
    let dates = [];

    const userStore = useContext(UserStoreContext);

    function getShifts(date) {
        if (!userStore.userShiftData) {
            return;
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
        
        let shifts = shiftData ? shiftData.shifts : [];

        return shifts;
    }

    for (let i = dateSpan.from; i < dateSpan.to; i++) {
        let dateMoment = moment().add(i, "days");

        dates.push(new CustomDate(
            parseInt(dateMoment.format("YYYY")),
            parseInt(dateMoment.format("M")),
            parseInt(dateMoment.format("D"))
        ));
    }

    return (
        <div className="NextDays">
            <div className="NextDays-days pure-g">
                {dates.map((date) => <NextDaysElement
                    gridWidth={dates.length}
                    shifts={getShifts(date)}
                    key={date.toFormattedString()}
                    date={date} />)
                }
            </div>
        </div>
    )
});

export default NextDays;