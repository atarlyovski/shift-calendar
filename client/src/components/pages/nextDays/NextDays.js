import React from 'react';
import moment from '../../../moment-with-locales.custom';
import CustomDate from '../../../CustomDate';
import NextDaysElement from './NextDaysElement';
import './NextDays.css';

const NextDays = () => {
    const dateSpan = {from: -1, to: 4};
    let dates = [];
    let nowFormatted = moment().format("YYYY-M-D");

    for (let i = dateSpan.from; i < dateSpan.to; i++) {
        let dateMoment = moment().add(i, "days");

        dates.push(new CustomDate(
            parseInt(dateMoment.format("YYYY")),
            parseInt(dateMoment.format("M")),
            parseInt(dateMoment.format("D"))
        ));
    }

    return (
        <div className="NextDays columns">
            <div class="column is-half is-offset-one-quarter">
                <div className="NextDays-days columns is-mobile">
                    {dates.map((date) => <NextDaysElement
                        gridWidth={dates.length}
                        key={date.toFormattedString()}
                        date={date}
                        isToday={date.toFormattedString() === nowFormatted} />)
                    }
                </div>
            </div>
        </div>
    )
};

export default NextDays;