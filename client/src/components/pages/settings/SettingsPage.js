import React from 'react';
import { useTranslation } from 'react-i18next';

const SettingsPage = ({children, isActive, setSettingsPage}) => {
    const { t } = useTranslation();

    return (
        <div className={"SettingsPage" + (isActive ? "" : " is-hidden")}>
            <div className="field">
                <div className="control">
                    <button
                        className="button is-black"
                        type="button"
                        onClick={() => setSettingsPage(null)}
                    >
                        {t("back")}
                    </button>
                </div>
            </div>
            {children}
        </div>
    )
};

export default SettingsPage;