import React from 'react';

import NextDaysElement from './NextDaysElement';

const OtherUser = ({fullName, userID, dates, nowFormatted}) => {
    return (
        <div className="OtherUser">
            <div className="OtherUser-fullName">
                {fullName}
            </div>
            <div className="NextDays-days columns is-mobile">
                {dates.map((date) => <NextDaysElement
                    userID={userID}
                    gridWidth={dates.length}
                    key={date.toFormattedString()}
                    date={date}
                    isToday={date.toFormattedString() === nowFormatted} />)
                }
            </div>
        </div>
    )
};

export default OtherUser;