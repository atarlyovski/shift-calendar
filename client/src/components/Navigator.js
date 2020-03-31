import React, { useContext } from 'react';
import './Navigator.css';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../mobx/viewStore';

const Navigator = observer(() => {
    let navButtons = [],
        navPages = [/*"day", */"nextDays", "month", "settings"];

    const viewStore = useContext(ViewStoreContext);

    const setActiveView = (e) => {
        viewStore.activePage = e.currentTarget.getAttribute("data-page");
    };

    for (let i = 0; i < navPages.length; i++) {
        // Use the active logo if it represents the current page
        let isActive = (viewStore.activePage === navPages[i]);
        let logo = require(`../img/${navPages[i] + (isActive ? "-active" : "")}.svg`);

        navButtons.push(
            <div
                    className="Navigator-btn"
                    data-page={navPages[i]}
                    data-is-active={viewStore.activePage === navPages[i] ? 1 : 0}
                    onClick={setActiveView}
                    key={i}>    
                <img className="Navigator-btn-logo"
                    alt={navPages[i]}
                    src={logo}/>
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