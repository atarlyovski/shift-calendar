import React from 'react';
import './Navigator.css';

export default function Navigator() {
    let navButtons = [],
        navPages = ["day", "nextDays", "month"],
        activePage = "nextDays";

    for (let i = 0; i < navPages.length; i++) {
        navButtons.push(
            <div
                className="Navigator-btn"
                data-is-active={navPages[i] === activePage ? 1 : 0}
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
}