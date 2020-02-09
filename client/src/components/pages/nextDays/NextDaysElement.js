import React, { useContext } from 'react';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../../../mobx/viewStore';

import { useShifts } from '../../../hooks/useShifts';
import './NextDaysElement.css';
import '../../../css/day.css';

const NextDaysElement = observer(({date, isToday}) => {
    const viewStore = useContext(ViewStoreContext);
    let shifts = useShifts(date);

    const onDayClick = (e, date) => {
        viewStore.activeDate = date;
        viewStore.activePage = "day";
    };

    return (
        <div className={"NextDaysElement column" + (isToday ? " today" : "")}>
            <div onClick={(e) => onDayClick(e, date)}>
                {/* <div>{date.toMoment().calendar()}</div> */}
                <div>{date.format("dd", navigator.language)}</div>
                <div>{date.format("D MMM", navigator.language)}</div>
                <div>{shifts}</div>
            </div>
        </div>
    )
});

export default NextDaysElement;