import React from 'react';
import './OtherUser.css';

import NextDaysElement from './NextDaysElement';

const OtherUser = ({fullName, userID, dates, isHomeData = {}, nowFormatted}) => {
    return (
        <div className="OtherUser">
            <div className="OtherUser-fullName">
                <span>{fullName}</span>
                <span className={'OtherUser-fullName-home' + (isHomeData.isHome ? '' : ' is-hidden')}> 🏠︎</span>
            </div>
            <div className="NextDays-days columns is-mobile">
                {dates.map((date) => <NextDaysElement
                    userID={userID}
                    gridWidth={dates.length}
                    isClickable={false}
                    key={date.toFormattedString()}
                    date={date}
                    isToday={date.toFormattedString() === nowFormatted} />)
                }
            </div>
        </div>
    )
};

export default OtherUser;