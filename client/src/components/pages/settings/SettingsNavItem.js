import React from 'react';

import './SettingsNavItem.css';

const SettingsNavItem = ({text, pageName, setActiveSettingsPage}) => {
    return (
        <div className="SettingsNavItem" onClick={() => setActiveSettingsPage(pageName)}>
            <span>{text}</span>
        </div>
    )
};

export default SettingsNavItem;