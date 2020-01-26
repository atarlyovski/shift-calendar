import React, { useContext } from 'react';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../../../mobx/viewStore';

import './NextDaysElement.css';

const NextDaysElement = observer(({date, gridWidth, shifts}) => {
    const viewStore = useContext(ViewStoreContext);

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
                <div>{shifts ? shifts.join("+") : "Nope-thing"}</div>
            </div>
        </div>
    )
});

export default NextDaysElement;