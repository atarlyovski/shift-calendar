import React from 'react';
import moment from '../../../moment-with-locales.custom';
import MonthElement from './MonthElement';
import CustomDate from '../../../CustomDate';

const Month = () => {
    let weeks;

    const getMonthDays = (currentMoment) => {
        let now = moment(currentMoment);
        let weeks = [];
        let prevDayMoment;

        for (let currentDay = 1; currentDay <= 31; currentDay++) {
            let currentDayMoment = now.date(currentDay);

            if (!currentDayMoment.isSame(currentMoment, "month")) {
                break;
            }

            if (weeks.length === 0 || !currentDayMoment.isSame(prevDayMoment, "isoWeek")) {
                weeks.push([]);
            }

            let date = new CustomDate(
                currentDayMoment.year(),
                currentDayMoment.month() + 1,
                currentDayMoment.date()
            );

            // weeks[weeks.length - 1] = weeks[weeks.length - 1] || [];

            weeks[weeks.length - 1].push(date);

            prevDayMoment = moment(now).date(currentDay);
        }

        return weeks;
    }

    weeks = getMonthDays(moment());

    weeks = weeks.map((days, i) => {
        return <div key={i} className="columns">
            {days.map(day => {
                return <MonthElement 
                    className="column"
                    key={day.toFormattedString()}
                    date={day} />
            })}
        </div>
    })

    return (
        <div>
            {weeks}
        </div>
    )
};

export default Month;