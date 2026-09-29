import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import './ViewContainer.css';
import ShiftSetter from './pages/ShiftSetter';
import NextDays from './pages/nextDays/NextDays';
import Month from './pages/month/Month';
import Settings from './pages/settings/Settings';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../mobx/viewStore';
import { UserStoreContext } from '../mobx/userStore';

export default observer(function ViewContainer() {
    const viewStore = useContext(ViewStoreContext);
    const userStore = useContext(UserStoreContext);
    const { t } = useTranslation();
    let [isChangingActiveUser, setIsChangingActiveUser] = useState(false);

    let availableUsers =
        ((userStore.userShiftData &&
            userStore.userShiftData.rooms.find(r => r.isActive)) || {}).availableUsers;

    let activeRoom = (userStore.userShiftData && userStore.userShiftData.rooms.find(r => r.isActive)) || null;
    let availableRooms = (userStore.userShiftData && userStore.userShiftData.rooms) || [];
    
    const [targetUserID, setTargetUserID] = useState(
        () => 
            (availableUsers && availableUsers.find(user => user.isActive).id) || null
    );

    useEffect(() => {
        setTargetUserID((availableUsers && availableUsers.find(user => user.isActive).id) || null);
    }, [availableUsers])

    const changeTargetUser = async (e) => {
        let targetUserUrl = '/api/user/setTargetUserID';
        let controller = new AbortController();
        let signal = controller.signal;

        let roomID = userStore
            .userShiftData
            .rooms
            .find(r => r.isActive)
            .roomID;

        let targetUserID = parseInt(e.target.value);
        
        let body = "roomID=" + roomID;
        body += "&targetUserID=" + targetUserID;

        setTargetUserID(targetUserID);

        userStore
            .userShiftData
            .rooms
            .find(r => r.isActive)
            .viewShiftsForUserID = targetUserID;

        try {
            setIsChangingActiveUser(true);

            let response = await fetch(targetUserUrl, {
                method: 'POST',
                credentials: "include",
                signal,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body
            });

            setIsChangingActiveUser(false);

            if (response.ok) {
                let result = await response.json();
                userStore.userShiftData = result;
            } else {
                console.error(response);
                alert(t("error"));
            }
        } catch (err) {
            setIsChangingActiveUser(false);
            alert(t("error"));
            console.error(err);
        }
    }

    const changeActiveRoom = async (e) => {
        const roomID = parseInt(e.target.value, 10);

        if (!roomID || !userStore.userShiftData || !userStore.userShiftData.rooms.length) {
            return;
        }

        try {
            const response = await fetch('/api/user/setActiveRoom', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'roomID=' + encodeURIComponent(roomID)
            });

            if (response.ok) {
                const result = await response.json();
                userStore.userShiftData = result;
            } else {
                console.error(response);
                alert(t('error'));
            }
        } catch (err) {
            console.error(err);
            alert(t('error'));
        }
    };

    let isShiftSettingDisabled = true;
    const viewsWithUserDropdown = ["day", "month"];
    let isUserDropdownVisible = viewsWithUserDropdown.includes(viewStore.activePage);
    
    if (userStore.user) {
        isShiftSettingDisabled =
            viewsWithUserDropdown.includes(viewStore.activePage) &&
            (targetUserID !== userStore.user.id);
    }

    return (
        <div className="ViewContainer container is-widescreen">
            <div className={"columns" + (isUserDropdownVisible ? "" : " is-hidden")}>
                <div className="ViewContainer-userSelect-container column is-narrow is-offset-2">
                    <div className="field">
                        <div className={"select is-fullwidth" + (isChangingActiveUser ? " is-loading" : "")}>
                            <select
                                onChange={changeTargetUser}
                                value={targetUserID || ""}
                                disabled={isChangingActiveUser}
                            >
                                {userStore.userShiftData &&
                                    userStore.userShiftData.rooms.find(r => r.isActive) &&
                                    (userStore.userShiftData.rooms.find(r => r.isActive).availableUsers || []).map(
                                        user => 
                                            <option key={user.id}
                                                    value={user.id}>
                                                {t("viewingUser", {name: user.fullName})}
                                            </option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
                {availableRooms.length > 1 ? (
                    <div className="ViewContainer-roomSelect-container column is-narrow">
                        <div className="field">
                            <div className="select is-fullwidth">
                                <select
                                    onChange={changeActiveRoom}
                                    value={activeRoom ? activeRoom.roomID : ""}
                                >
                                    {availableRooms.map(room => (
                                        <option key={room.roomID} value={room.roomID}>
                                            {room.name || `${t('room')} ${room.roomID}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
            <ShiftSetter
                date={viewStore.activeDate || new Date()}
                isDisabled={isShiftSettingDisabled}
                isActive={viewStore.shiftSetterIsActive} />
            {viewStore.activePage === "nextDays" ? <NextDays /> : null}
            {viewStore.activePage === "month" ? <Month /> : null}
            {viewStore.activePage === "settings" ? <Settings /> : null}
        </div>
    )
});