import React, { useContext } from 'react';
import './Navigator.css';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../mobx/viewStore';

const Navigator = observer(() => {
    let navButtons = [],
        navPages = ["day", "nextDays", "month", "⚙"];

    const viewStore = useContext(ViewStoreContext);

    const setActiveView = (e) => {
        viewStore.activePage = e.target.getAttribute("data-page");
    };

    for (let i = 0; i < navPages.length; i++) {
        navButtons.push(
            <div
                className="Navigator-btn"
                data-page={navPages[i]}
                data-is-active={viewStore.activePage === navPages[i] ? 1 : 0}
                onClick={setActiveView}
                key={i}>
                {navPages[i]}
            </div>
        )
    }

    return (
        <nav className="Navigator">
            {navButtons}
        </nav>
    )
});

export default Navigator;