import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../../mobx/userStore';
import { ViewStoreContext } from '../../mobx/viewStore';

import { useShifts } from '../../hooks/useShifts';
import { useLocale } from '../../hooks/useLocale';

import './ShiftSetter.css'

const ShiftSetter = observer(({date, isActive, isDisabled}) => {
    let userStore = useContext(UserStoreContext);
    let viewStore = useContext(ViewStoreContext);
    const { t } = useTranslation();
    let locale = useLocale();
    let [isPosting, setIsPosting] = useState(false);

    // Use the current user's ID when displaying shifts
    // in views other than Month regardless of the target user ID.
    // This makes sure that the user sees his shifts in ShiftSetter when in NextDays.
    let userID = (viewStore.activeDate !== "month" ? userStore.user.id : undefined);
    let shifts = useShifts(date, {format: "array", userID});

    let title = date.toLocaleDateString(locale, {weekday: 'long', month: 'long', day: 'numeric'});

    const allowedShifts = userStore.user.allowedShifts || [];

    const toggleShift = async (e) => {
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

        await postShifts(viewStore.activeDate, newShifts, userStore.userShiftData.activeRoomData.id);
    }

    const updateStoreShifts = (date, shifts) => {
        let formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        try {
            let shiftData = userStore
                .userShiftData
                .activeRoomData
                .shiftData
                .filter(day =>
                    day.date !== formattedDate ||
                    day.userID !== userStore.user.id
                );
            
            shiftData.push({
                userID: userStore.user.id,
                date: formattedDate,
                shifts
            });

            userStore.userShiftData.activeRoomData.shiftData = shiftData;
        } catch (err) {
            console.error(err);
        }
    }

    const postShifts = async (date, shifts, roomID) => {
        let shiftPostUrl = '/api/shifts/shifts';

        let body = "date=" + encodeURIComponent(JSON.stringify({year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), stringFormat: "YYYY-M-D"}));
        body += "&shifts=" + encodeURIComponent(JSON.stringify(shifts));
        body += "&roomID=" + encodeURIComponent(roomID);

        try {
            setIsPosting(true);

            let response = await fetch(shiftPostUrl, {
                method: "post",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body
            });

            setIsPosting(false);

            if (!response.ok) {
                alert(t("error"));
                console.error("Couldn't set shifts...");
            }
        } catch (err) {
            setIsPosting(false);

            if (err.name === 'AbortError') {
                console.log("fetch aborted");
            } else {
                alert(t("error"));
                console.error(err);
            }
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
                    <button
                        disabled={isPosting}
                        className="delete"
                        aria-label="close"
                        onClick={() => {viewStore.shiftSetterIsActive = false}}
                    ></button>
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
                                                disabled={isDisabled || isPosting}
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
                    <button
                        className={"button" + (isPosting ? " is-loading" : "")}
                        onClick={closeShiftSetter}
                    >
                        {t("close")}
                    </button>
                </footer>
            </div>
        </div>
    )
});

export default ShiftSetter;