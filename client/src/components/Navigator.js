import React, { useContext } from 'react';
import './Navigator.css';
import dayLogo from '../img/day.svg';
import nextDaysLogo from '../img/nextDays.svg';
import monthLogo from '../img/month.svg';
import settingsLogo from '../img/settings.svg';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../mobx/viewStore';

const Navigator = observer(() => {
    let navButtons = [],
        navPages = ["day", "nextDays", "month", "settings"];

    const viewStore = useContext(ViewStoreContext);

    const setActiveView = (e) => {
        viewStore.activePage = e.currentTarget.getAttribute("data-page");
    };

    for (let i = 0; i < navPages.length; i++) {
        let logo;

        switch (navPages[i]) {
            case "day":
                logo = dayLogo;
                break;
        
            case "nextDays":
                logo = nextDaysLogo;
                break;
                
            case "month":
                logo = monthLogo;
                break;
                
            case "settings":
                logo = settingsLogo;
                break;

            default:
                break;
        }

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