import React, { useState } from 'react';

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

    const [index, setIndex] = useState(1); // Current active index
    const monthOffsets = [-1, 0, 1]; // Offsets for previous, current, and next months

    const adjustMonth = (date, offset) => {
        const newDate = new Date(date);
        newDate.setDate(1); // Set to the first day of the month to avoid overflow issues
        newDate.setMonth(newDate.getMonth() + offset); // Add or subtract the month
        const daysInMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate(); // Get days in the new month
        newDate.setDate(Math.min(date.getDate(), daysInMonth)); // Set the day, ensuring it doesn't exceed the last day of the month
        return newDate;
    };

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
                    weeks[0].push({ type: 'placeholder', colSpan: dayOfWeek - 1 });
                }
            }

            let date = new Date(currentDayMoment.getFullYear(), currentDayMoment.getMonth(), currentDayMoment.getDate());

            weeks[weeks.length - 1].push({ type: 'day', date });
        }

        return weeks;
    };

    const getDaysOfWeek = (currentMoment) => {
        let headings = [];
        const { format } = new Intl.DateTimeFormat(locale, { weekday: 'short' });
        let now = new Date(currentMoment);
        let startDay = new Date(now.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)));

        for (let i = 0; i < 7; i++) {
            headings.push(<th key={i}>{format(startDay)}</th>);
            startDay.setDate(startDay.getDate() + 1);
        }

        return headings;
    };

    weeks = monthOffsets.map((offset) =>
        getMonthDays(adjustMonth(now, offset))
    );

    daysOfWeek = getDaysOfWeek(now);

    months = monthOffsets.map((offset) =>
        adjustMonth(now, offset).toLocaleString(locale, { month: 'long' })
    );

    let rows = weeks.map((monthWeek) => {
        return monthWeek.map((days, i) => {
            return (
                <tr key={i}>
                    {days.map((day) => {
                        return day.type === 'day' ? (
                            <MonthElement
                                className="column"
                                key={day.date.toLocaleDateString()}
                                date={day.date}
                                isToday={`${day.date.getFullYear()}-${day.date.getMonth() + 1}-${day.date.getDate()}` ===
                                    nowFormatted}
                            />
                        ) : (
                            <td
                                key="placeholder"
                                className="MonthFirstWeekPlaceholder"
                                colSpan={day.colSpan}
                            ></td>
                        );
                    })}
                </tr>
            );
        });
    });

    return (
        <div className="Month">
            <div className="month-heading columns">
                <div className="column is-8 is-offset-2">
                    {index >= 1 ? (
                        <button
                            onClick={() => {
                                setIndex((prev) => prev - 1);
                            }}
                        >
                            <span className="prev-month"></span>
                        </button>
                    ) : null}
                    <h2 className="title">
                        <span>{months[index]}</span>
                    </h2>
                    {index <= 1 ? (
                        <button
                            onClick={() => {
                                setIndex((prev) => prev + 1);
                            }}
                        >
                            <span className="next-month"></span>
                        </button>
                    ) : null}
                </div>
            </div>
            <div
                className="Month-swipe-container"
            >
                {monthOffsets.map((monthOffset, i) => {
                    return (
                        <div className="columns"
                            key={i}
                            data-index={i}
                            style={{
                                transform: `translateX(-${index * 100}%)`
                            }}
                        >
                            <div className="MonthTable-container column is-8 is-offset-2">
                                <div className="table-container">
                                    <table className="MonthTable table is-bordered is-fullwidth is-narrow">
                                        <thead>
                                            <tr>{daysOfWeek}</tr>
                                        </thead>
                                        <tbody>{rows[i]}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Month;