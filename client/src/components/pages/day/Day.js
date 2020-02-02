import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import CustomDate from '../../../CustomDate';
import { ViewStoreContext } from '../../../mobx/viewStore';
import { useShifts } from '../../../hooks/useShifts';
import ShiftSetter from './ShiftSetter';

const Day = observer(() => {
    const viewStore = useContext(ViewStoreContext);
    const { t } = useTranslation();

    let date = viewStore.activeDate;
    
    if (!date) {
        date = new CustomDate();
        viewStore.activeDate = date;
    }
    
    let shifts = useShifts(date);

    const showShiftSetter = () => {
        viewStore.shiftSetterIsActive = true;
    }

    return (
        <div className="Day">
            {viewStore.shiftSetterIsActive ? <ShiftSetter date={date} /> : null}
            <div>{date.format("dddd", navigator.language)}</div>
            <div>{date.format("D MMMM", navigator.language)}</div>
            {shifts && shifts.length ? shifts.join("+") : "-"}
            <div>
                <button className="pure-button" onClick={showShiftSetter}>{t("setShifts")}</button>
            </div>
        </div>
    )
});

export default Day;