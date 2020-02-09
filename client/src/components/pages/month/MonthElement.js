import React, { useContext } from 'react';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../../../mobx/viewStore';

import { useShifts } from '../../../hooks/useShifts';

const MonthElement = observer(({date}) => {
    const viewStore = useContext(ViewStoreContext);
    let shifts = useShifts(date);

    const onDayClick = (e, date) => {
        viewStore.activeDate = date;
        viewStore.activePage = "day";
    };

    return (
        <div className={"MonthElement column"}>
            <div onClick={(e) => onDayClick(e, date)}>
                {/* <div>{date.toMoment().calendar()}</div> */}
                <div>{date.format("D", navigator.language)}</div>
                <div>{shifts && shifts.length ? shifts.join("+") : "-"}</div>
            </div>
        </div>
    )
});

export default MonthElement;