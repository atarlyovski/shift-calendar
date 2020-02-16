import React, { useContext, useEffect } from 'react';
import moment from '../../moment-with-locales.custom';
import { useTranslation } from 'react-i18next';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../../mobx/userStore';
import { ViewStoreContext } from '../../mobx/viewStore';
import { MiscStoreContext } from '../../mobx/miscStore';

import { useShifts } from '../../hooks/useShifts';

import './ShiftSetter.css'

const ShiftSetter = observer(({date, isActive, isDisabled}) => {
    let shifts = useShifts(date, {format: "array"});
    let userStore = useContext(UserStoreContext);
    let viewStore = useContext(ViewStoreContext);
    let miscStore = useContext(MiscStoreContext);
    const { t } = useTranslation();

    let title = date.format("dddd[, ]D[ ]MMMM");

    const allowedShifts = userStore.user.allowedShifts || [];

    const toggleShift = (e) => {
        let shift = e.target.getAttribute("data-shift");
        let newShifts = [...shifts];

        if (e.target.checked && !newShifts.includes(shift)) {
            newShifts.push(shift);
        } else if (!e.target.checked && newShifts.includes(shift)) {
            newShifts = newShifts.filter(s => s !== shift);
        } else {
            return;
        }

        newShifts.sort((a, b) => {
            let allowedShifts = userStore.user.allowedShifts;

            let aAllowed = allowedShifts.find(shift => shift.shiftName === a);
            let bAllowed = allowedShifts.find(shift => shift.shiftName === b);
            
            if (!aAllowed || !bAllowed) {
                return 0;
            }

            return aAllowed.order - bAllowed.order;
        });

        updateStoreShifts(viewStore.activeDate, newShifts);
        postShifts(viewStore.activeDate, newShifts, userStore.userShiftData.activeRoomData.id);
    }

    const updateStoreShifts = (date, shifts) => {
        let activeRoom = userStore
            .userShiftData
            .rooms
            .find(r => r.isActive) || {};

        try {
            if (userStore.user.id === activeRoom.viewShiftsForUserID) {
                let shiftData = userStore
                    .userShiftData
                    .activeRoomData
                    .shiftData
                    .filter(day => day.date !== date.toFormattedString());
                
                shiftData.push({
                    userID: userStore.user.id,
                    date: date.toFormattedString(),
                    shifts
                });

                userStore.userShiftData.activeRoomData.shiftData = shiftData;
            }
        } catch (err) {
            console.error(err);
        }
    }

    const postShifts = async (date, shifts, roomID) => {
        let shiftPostUrl = '/api/shifts/shifts';

        let data = {
            date,
            shifts,
            roomID
        };

        try {
            let response = await fetch(miscStore.serverHost + shiftPostUrl, {
                method: "post",
                credentials: "include",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                console.error("Couldn't set shifts...");
            }
        } catch (err) {
            console.error(err);
        }
    }

    const closeShiftSetter = () => {
        viewStore.shiftSetterIsActive = false;
    }

    return (
        <div className={"ShiftSetter modal" + (isActive ? " is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{title}</p>
                    <button className="delete" aria-label="close" onClick={() => {viewStore.shiftSetterIsActive = false}}></button>
                </header>
                <section className="modal-card-body">
                    {allowedShifts.map(
                        (allowedShift, i) => 
                            <div className="field" key={i}>
                                <div className="control">
                                    <label
                                        htmlFor={"set-shift-" + allowedShift.shiftName}
                                        className="checkbox">
                                            <input
                                                id={"set-shift-" + allowedShift.shiftName}
                                                data-shift={allowedShift.shiftName}
                                                type="checkbox"
                                                disabled={isDisabled}
                                                onChange={(e) => toggleShift(e)}
                                                checked={shifts.includes(allowedShift.shiftName)} />
                                            {" " + allowedShift.shiftName}
                                    </label>
                                </div>
                            </div>
                    )}
                    <div className={"notification is-danger " + (!isDisabled ? "is-hidden" : "")}>
                        {t("youCannotSetShiftsForOthers")}
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-black" onClick={closeShiftSetter}>{t("close")}</button>
                </footer>
            </div>
        </div>
    )
});

export default ShiftSetter;