import React, { useContext } from 'react';
import './Navigator.css';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../mobx/viewStore';

const Navigator = observer(() => {
    let navButtons = [],
        navPages = ["nextDays", "month", "settings"];

    const viewStore = useContext(ViewStoreContext);

    const setActiveView = (e) => {
        viewStore.activePage = e.currentTarget.getAttribute("data-page");
    };

    for (let i = 0; i < navPages.length; i++) {
        // Use the active logo if it represents the current page
        let isActive = (viewStore.activePage === navPages[i]);
        let logo = `/img/${navPages[i]}.svg`;

        navButtons.push(
            <div
                    className="Navigator-btn"
                    data-page={navPages[i]}
                    data-is-active={viewStore.activePage === navPages[i] ? 1 : 0}
                    onClick={setActiveView}
                    key={i}>    
                <img className={"Navigator-btn-logo" + (isActive ? " active" : "")}
                    alt={navPages[i]}
                    src={logo}/>
            </div>
        )
    }

    return (
        <nav className="Navigator">
            <div className="columns is-centered is-gapless">
                <div className="column is-4-widescreen is-half-tablet">
                    <div className="Navigator-buttons container">
                        {navButtons}
                    </div>
                </div>
            </div>
        </nav>
    )
});

export default Navigator;