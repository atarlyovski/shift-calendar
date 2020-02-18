import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import CustomDate from '../../../CustomDate';
import { ViewStoreContext } from '../../../mobx/viewStore';
import { useShifts } from '../../../hooks/useShifts';

import './Day.css';

const Day = observer(({isDisabled}) => {
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
        <div className="Day columns">
            <div className="Day-box column is-2 is-offset-5">
                <div>{date.format("dddd", navigator.language)}</div>
                <div>{date.format("D MMMM", navigator.language)}</div>
                {shifts}
                <div>
                    <button className="button is-black"
                            disabled={isDisabled}
                            onClick={showShiftSetter}>
                        {t("setShifts")}
                    </button>
                </div>
                {isDisabled ? <div>{t("youCannotSetShiftsForOthers")}</div> : false}
            </div>
        </div>
    )
});

export default Day;