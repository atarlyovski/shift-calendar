import React from 'react';

import './NextDaysElement.css';

const NextDaysElement = ({date, gridWidth}) => {
    return (
        <div className={"NextDaysElement pure-u-1-" + gridWidth}>
            {/* <div>{date.toMoment().calendar()}</div> */}
            <div>{date.format("dd", navigator.language)}</div>
            <div>{date.format("D MMM", navigator.language)}</div>
        </div>
    )
};

export default NextDaysElement;