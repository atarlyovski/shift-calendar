import React from 'react';
import moment from '../../../moment-with-locales.custom';
import MonthElement from './MonthElement';
import CustomDate from '../../../CustomDate';
import './Month.css';

const Month = () => {
    let month,
        weeks,
        now = moment(),
        nowFormatted = now.format("YYYY-M-D");

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

            // Add a placeholder for days from the previous month in the first week
            if (currentDay === 1) {
                let dayOfWeek = parseInt(currentDayMoment.format("E"))

                if (dayOfWeek !== 1) {
                    weeks[0].push({type: "placeholder", colSpan: dayOfWeek - 1})
                }
            }

            let date = new CustomDate(
                currentDayMoment.year(),
                currentDayMoment.month() + 1,
                currentDayMoment.date()
            );

            // weeks[weeks.length - 1] = weeks[weeks.length - 1] || [];

            weeks[weeks.length - 1].push({type: "day", date});

            prevDayMoment = moment(now).date(currentDay);
        }

        return weeks;
    }

    weeks = getMonthDays(now);
    month = now.format("MMMM", navigator.language);

    let rows = weeks.map((days, i) => {
        return (
            <tr key={i}>
                {days.map(day => {
                    return (
                        day.type === "day" ? <MonthElement 
                            className="column"
                            key={day.date.toFormattedString()}
                            date={day.date}
                            isToday={day.date.toFormattedString() === nowFormatted} />
                            :
                            <td key="placeholder"
                                className="MonthFirstWeekPlaceholder"
                                colSpan={day.colSpan}></td>
                    )
                })}
            </tr>
        )
    })

    return (
        <div className="Month">
            <h2 className="title">{month}</h2>
            <div className="columns">
                <div className="column is-8 is-offset-2">
                    <div className="table-container">
                        <table className="MonthTable table is-bordered is-fullwidth is-narrow">
                            <thead>
                                <tr></tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Month;