import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';

import moment from '../../../moment-with-locales.custom';
import MonthElement from './MonthElement';
import CustomDate from '../../../CustomDate';
import { useLocale } from '../../../hooks/useLocale';

import './Month.css';

const Month = () => {
    let months,
        weeks,
        now = moment(),
        nowFormatted = now.format("YYYY-M-D"),
        locale = useLocale(),
        daysOfWeek;

    const [index, setIndex] = useState(1);
    const monthOffsets = [-1, 0, 1];

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

    const getDaysOfWeek = (currentMoment) => {
        let headings = [];
        let now = moment(currentMoment);
        let startDay = parseInt(now.startOf("isoWeek").format("E"));
        let endDay = parseInt(now.endOf("isoWeek").format("E"));

        for (let i = startDay; i <= endDay; i++) {
            headings.push(
                <th key={i}>{
                    now.isoWeekday(i)
                        .locale(locale)
                        .format("dd")
                    }</th>
            )
        }

        return headings;
    }

    weeks = monthOffsets.map(offset => 
        getMonthDays(moment(now).add(offset, "month"))
    );

    daysOfWeek = getDaysOfWeek(now);

    months = monthOffsets.map(offset => 
        moment(now).add(offset, "month").locale(locale).format("MMMM")
    );

    let rows = weeks.map(monthWeeks => {
        return monthWeeks.map((days, i) => {
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
            )}
        )}
    )

    return (
        <div className="Month">
            <div className="month-heading columns">
                <div className="column is-8 is-offset-2">
                    {index >= 1 ?
                        <div className="prev-month"
                            onClick={() => setIndex(o => o - 1)}>
                        </div> : false
                    }
                    <h2 className="title">
                        <span>{months[index]}</span>
                    </h2>
                    {index <= 1 ?
                        <div className="next-month"
                            onClick={() => setIndex(o => o + 1)}>
                        </div> : false
                    }
                </div>
            </div>
            <SwipeableViews
                index={index}
                onChangeIndex={setIndex}
            >
                {monthOffsets.map((monthOffset, i) => {
                    return <div className="columns" key={i}>
                        <div className="MonthTable-container column is-8 is-offset-2">
                            <div className="table-container">
                                <table className="MonthTable table is-bordered is-fullwidth is-narrow">
                                    <thead>
                                        <tr>
                                            {daysOfWeek}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows[i]}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                })}
            </SwipeableViews>
        </div>
    )
};

export default Month;