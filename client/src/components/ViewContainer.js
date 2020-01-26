import React, { useContext } from 'react';
import './ViewContainer.css';
import Day from './pages/day/Day';
import NextDays from './pages/nextDays/NextDays';
import Month from './pages/month/Month';
import Settings from './pages/settings/Settings';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../mobx/viewStore';

export default observer(function ViewContainer() {
    const viewStore = useContext(ViewStoreContext);

    return (
        <div className="ViewContainer">
            {viewStore.activePage === "day" ? <Day date={viewStore.activeDate} /> : null}
            {viewStore.activePage === "nextDays" ? <NextDays /> : null}
            {viewStore.activePage === "month" ? <Month /> : null}
            {viewStore.activePage === "⚙" ? <Settings /> : null}
        </div>
    )
});