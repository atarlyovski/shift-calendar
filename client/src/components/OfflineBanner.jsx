import React from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigatorOnline } from '../hooks/useNavigatorOnline';
import './OfflineBanner.css';

function OfflineBanner() {
    const { t } = useTranslation();
    let isOnline = useNavigatorOnline();

    return (
        <div
            className="OfflineBanner"
            data-state={isOnline ? "online" : "offline"}>
                {t("offline")}
        </div>
    )
}

export default OfflineBanner;