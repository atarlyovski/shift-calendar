import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views-react-18-fix';

import MonthElement from './MonthElement';
import { useLocale } from '../../../hooks/useLocale';

import './Month.css';

const Month = () => {
    let months,
        weeks,
        now = new Date(),
        nowFormatted = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
        locale = useLocale(),
        daysOfWeek;

    const [index, setIndex] = useState(1);
    const monthOffsets = [-1, 0, 1];

    const getMonthDays = (currentMoment) => {
        let now = new Date(currentMoment);
        let weeks = [];

        for (let currentDay = 1; currentDay <= 31; currentDay++) {
            let currentDayMoment = new Date(now.getFullYear(), now.getMonth(), currentDay);

            if (currentDayMoment.getMonth() !== now.getMonth()) {
                break;
            }

            if (weeks.length === 0 || currentDayMoment.getDay() === 1) {
                weeks.push([]);
            }

            // Add a placeholder for days from the previous month in the first week
            if (currentDay === 1) {
                let dayOfWeek = currentDayMoment.getDay() === 0 ? 7 : currentDayMoment.getDay(); // 0 is Sunday, 1 is Monday, etc.

                if (dayOfWeek !== 1) {
                    weeks[0].push({type: "placeholder", colSpan: dayOfWeek - 1})
                }
            }

            let date = new Date(currentDayMoment.getFullYear(), currentDayMoment.getMonth(), currentDayMoment.getDate());

            weeks[weeks.length - 1].push({type: "day", date});
        }

        return weeks;
    }

    const getDaysOfWeek = (currentMoment) => {
        let headings = [];
        const { format } = new Intl.DateTimeFormat(locale, { weekday: 'short' });
        let now = new Date(currentMoment);
        let startDay = new Date(now.setDate(now.getDate() - now.getDay() === 0 ? 7 : now.getDay()));

        for (let i = 0; i < 7; i++) {
            headings.push(
                <th key={i}>{
                    format(startDay)
                    }</th>
            )

            startDay.setDate(startDay.getDate() + 1);
        }

        return headings;
    }

    weeks = monthOffsets.map(offset => 
        getMonthDays(new Date(now.getFullYear(), now.getMonth() + offset, now.getDate()))
    );

    daysOfWeek = getDaysOfWeek(now);

    months = monthOffsets.map(offset => 
        new Date(now.getFullYear(), now.getMonth() + offset, now.getDate()).toLocaleString(locale, { month: 'long' })
    );

    let rows = weeks.map(monthWeek => {
        return monthWeek.map((days, i) => {
            return (
                <tr key={i}>
                    {days.map(day => {
                        return (
                            day.type === "day" ? <MonthElement 
                                className="column"
                                key={day.date.toLocaleDateString()}
                                date={day.date}
                                isToday={`${day.date.getFullYear()}-${day.date.getMonth() + 1}-${day.date.getDate()}` === nowFormatted} />
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
                        <button onClick={() => setIndex(o => o - 1)}>
                            <span className="prev-month"></span>
                        </button> : false
                    }
                    <h2 className="title">
                        <span>{months[index]}</span>
                    </h2>
                    {index <= 1 ?
                        <button onClick={() => setIndex(o => o + 1)}>
                            <span className="next-month"></span>
                        </button> : false
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