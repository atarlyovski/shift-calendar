import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import './ViewContainer.css';
import Day from './pages/day/Day';
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

    const availableUsers =
        (userStore.user.rooms.find(r => r.isActive) || {}).availableUsers || [];

    return (
        <div className="ViewContainer">
            <select className="select">
                {availableUsers.map(
                    user => 
                        <option
                            value={user.id}
                            selected={user.isActive}>
                                {t("viewingUser", {name: user.fullName})}
                        </option>
                )}
            </select>
            {viewStore.activePage === "day" ? <Day date={viewStore.activeDate} /> : null}
            {viewStore.activePage === "nextDays" ? <NextDays /> : null}
            {viewStore.activePage === "month" ? <Month /> : null}
            {viewStore.activePage === "⚙" ? <Settings /> : null}
        </div>
    )
});