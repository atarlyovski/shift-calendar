import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './UserIsHomeStatus.css';

const calculateMinutesAgo = dateMs => {
    const now = new Date();
    const date = new Date(dateMs);
    const diff = now - date;
    return Math.floor(diff / 1000 / 60);
};

const UserIsHomeStatus = ({ isHomeData }) => {
    const { t } = useTranslation();
    const isHomeCheckEnabled = isHomeData && isHomeData.isHome !== undefined;
    const isHome = isHomeCheckEnabled && isHomeData.isHome && isHomeData.lastCheck > new Date().getTime() - 30 * 60 * 1000;
    const [statusLine, setStatusLine] = useState(t('unknownLocationShort'));

    useEffect(() => {
        const getIsHomeStatusLine = (isHomeData) => {
            let statusLine = t('unknownLocationShort');
        
            if (isHome) {
                let minutesAgo = calculateMinutesAgo(isHomeData.lastCheck);

                if (minutesAgo <= 2) {
                    statusLine = t('atHomeNow');
                } else if (minutesAgo < 30) {
                    statusLine = t('atHome', { minutesAgo: calculateMinutesAgo(isHomeData.lastCheck) });
                }
            } else if (isHomeData && isHomeData.lastSeenHome) {
                let minutesAgo = calculateMinutesAgo(isHomeData.lastSeenHome);

                // convert to hours, days, etc.
                if (minutesAgo < 60) {
                    statusLine = t('lastSeenHomeMinutes', { minutesAgo });
                } else if (minutesAgo < 60 * 24) {
                    statusLine = t('lastSeenHomeHours', { hoursAgo: Math.floor(minutesAgo / 60) });
                } else {
                    statusLine = t('lastSeenHomeDays', { daysAgo: Math.floor(minutesAgo / (60 * 24)) });
                }
            }
        
            return statusLine;
        };

        setStatusLine(getIsHomeStatusLine(isHomeData));

        if (isHome) {
            setInterval(() => {
                setStatusLine(getIsHomeStatusLine(isHomeData));
            }, 60 * 1000);
        }
    }, [isHome, isHomeData, t]);

    return <span className={"UserIsHomeStatus-line" + (isHomeCheckEnabled ? (isHome ? " is-home" : "") : " is-hidden")}>{statusLine}</span>
}

export default UserIsHomeStatus;