import React, { useContext } from 'react';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../../../mobx/viewStore';

import { useShifts } from '../../../hooks/useShifts';
import '../../../css/day.css';
import './MonthElement.css';

const MonthElement = observer(({date, isToday}) => {
    const viewStore = useContext(ViewStoreContext);
    let shifts = useShifts(date);

    const onDayClick = (e, date) => {
        viewStore.activeDate = date;
        viewStore.shiftSetterIsActive = true;
    };

    return (
        <td className={"MonthElement" + (isToday ? " today" : "")}
                data-day-of-week={date.getDay() === 0 ? 7 : date.getDay()}>
            <div onClick={(e) => onDayClick(e, date)}>
                <div>{date.getDate()}</div>
                <div>{shifts}</div>
            </div>
        </td>
    )
});

export default MonthElement;