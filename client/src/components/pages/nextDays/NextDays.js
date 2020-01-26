import React from 'react';
import moment from '../../../moment-with-locales.custom';
import CustomDate from '../../../CustomDate';
import NextDaysElement from './NextDaysElement';

const NextDays = () => {
    const dateSpan = {from: -1, to: 4};
    let dates = [];

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
                    key={date.toFormattedString()}
                    date={date} />)
                }
            </div>
        </div>
    )
};

export default NextDays;