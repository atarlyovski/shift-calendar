import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './ViewContainer.css';
import Day from './pages/day/Day';
import NextDays from './pages/nextDays/NextDays';
import Month from './pages/month/Month';
import Settings from './pages/settings/Settings';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../mobx/viewStore';
import { UserStoreContext } from '../mobx/userStore';
import { MiscStoreContext } from '../mobx/miscStore';

export default observer(function ViewContainer() {
    const viewStore = useContext(ViewStoreContext);
    const userStore = useContext(UserStoreContext);
    const miscStore = useContext(MiscStoreContext);
    const { t } = useTranslation();

    
    let availableUsers =
        (userStore.user.rooms.find(r => r.isActive) || {}).availableUsers;
    
    const [targetUserID, setTargetUserID] = useState(
        () => 
            (availableUsers && availableUsers.find(user => user.isActive).id) || null
    );
    
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
            let response = await fetch(miscStore.serverHost + targetUserUrl, {
                method: 'POST',
                credentials: "include",
                mode: 'cors',
                signal,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body
            });

            if (response.ok) {
                let result = await response.json();
                userStore.userShiftData = result;
            } else {
                console.error(response);
                alert(t("error"));
            }
        } catch (err) {
            alert(t("error"));
        }
    }

    let isShiftSettingDisabled = true;
    
    if (userStore.user) {
        isShiftSettingDisabled = (targetUserID !== userStore.user.id);
    }

    return (
        <div className="ViewContainer">
            <select className="select"
                    onChange={changeTargetUser}
                    value={targetUserID}>
                {availableUsers && availableUsers.map(
                    user => 
                        <option key = {user.id}
                                value={user.id}>
                            {t("viewingUser", {name: user.fullName})}
                        </option>
                )}
            </select>
            {viewStore.activePage === "day" ? <Day isDisabled={isShiftSettingDisabled} /> : null}
            {viewStore.activePage === "nextDays" ? <NextDays /> : null}
            {viewStore.activePage === "month" ? <Month /> : null}
            {viewStore.activePage === "settings" ? <Settings /> : null}
        </div>
    )
});