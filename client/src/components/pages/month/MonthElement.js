import React, { useContext } from 'react';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../../../mobx/viewStore';

import { useShifts } from '../../../hooks/useShifts';
import '../../../css/day.css';

const MonthElement = observer(({date, isToday}) => {
    const viewStore = useContext(ViewStoreContext);
    let shifts = useShifts(date);

    const onDayClick = (e, date) => {
        viewStore.activeDate = date;
        // viewStore.activePage = "day";
        viewStore.shiftSetterIsActive = true;
    };

    return (
        <td className={"MonthElement" + (isToday ? " today" : "")}>
            <div onClick={(e) => onDayClick(e, date)}>
                {/* <div>{date.toMoment().calendar()}</div> */}
                <div>{date.format("D", navigator.language)}</div>
                <div>{shifts}</div>
            </div>
        </td>
    )
});

export default MonthElement;