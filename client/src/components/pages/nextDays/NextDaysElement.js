import React, { useContext } from 'react';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../../../mobx/viewStore';

import { useShifts } from '../../../hooks/useShifts';
import { useLocale } from '../../../hooks/useLocale';

import './NextDaysElement.css';
import '../../../css/day.css';

const NextDaysElement = observer(({
    userID,
    date,
    isToday,
    isClickable = true
}) => {
    const viewStore = useContext(ViewStoreContext);
    let shifts = useShifts(date, {userID});
    let locale = useLocale();

    const onDayClick = (e, date) => {
        viewStore.activeDate = date;
        viewStore.shiftSetterIsActive = true;
    };

    return (
        <div className={"NextDaysElement column" + (isToday ? " today" : "")}>
            <div onClick={isClickable ? (e => onDayClick(e, date)) : undefined}>
                {/* <div>{date.toMoment().calendar()}</div> */}
                <div className="is-hidden-desktop-only is-hidden-touch">{date.format("dddd", locale)}</div>
                <div className="is-hidden-widescreen">{date.format("dd", locale)}</div>
                <div>{date.format("D", locale)}</div>
                <div>{shifts}</div>
            </div>
        </div>
    )
});

export default NextDaysElement;