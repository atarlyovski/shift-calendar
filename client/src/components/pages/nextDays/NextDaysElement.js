import React, { useContext } from 'react';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../../../mobx/viewStore';

import { useShifts } from '../../../hooks/useShifts';
import './NextDaysElement.css';

const NextDaysElement = observer(({date, gridWidth}) => {
    const viewStore = useContext(ViewStoreContext);
    let shifts = useShifts(date);

    const onDayClick = (e, date) => {
        viewStore.activeDate = date;
        viewStore.activePage = "day";
    };

    return (
        <div className={"NextDaysElement pure-u-1-" + gridWidth}>
            <div onClick={(e) => onDayClick(e, date)} data-date={date}>
                {/* <div>{date.toMoment().calendar()}</div> */}
                <div>{date.format("dd", navigator.language)}</div>
                <div>{date.format("D MMM", navigator.language)}</div>
                <div>{shifts ? shifts.join("+") : ""}</div>
            </div>
        </div>
    )
});

export default NextDaysElement;