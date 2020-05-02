import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import preval from 'preval.macro';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../../../mobx/userStore';

import DbStateSetter from './DbStateSetter';
import SettingsNavItem from './SettingsNavItem';
import SettingsPage from './SettingsPage';

const buildDate = preval`module.exports =
    require("../../../moment-with-locales.custom")
    (new Date()).format("YYYY-MM-DD");
`;

const Settings = observer(() => {
    const userStore = useContext(UserStoreContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [isInvalidPasswordCombo, setIsInvalidPasswordCombo] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [settingsPage, setSettingsPage] = useState(null);
    const { t } = useTranslation();

    const logOut = async () => {
        var logOutURL = '/api/user/logout',
            response;
        
        try {
            setIsLoggingOut(true);

            response = await fetch(logOutURL, {
                credentials: "include",
                method: 'post',
            });

            setIsLoggingOut(false);

            if (response.ok) {
                userStore.user = null;
            } else {
                console.error(response);
                alert(t("error"));
            }
        } catch (err) {
            setIsLoggingOut(false);
            console.error(err);
            return;
        }
    };

    const changePassword = async () => {
        var changePasswordUrl = '/api/user/changePassword',
            body,
            response;
        
        if (!oldPassword ||
                !newPassword ||
                !newPasswordConfirm ||
                newPasswordConfirm !== newPassword) {
            setIsInvalidPasswordCombo(true);
            return;
        } else {
            setIsInvalidPasswordCombo(false);
        }

        body = "oldPassword=" + encodeURIComponent(oldPassword);
        body += "&newPassword=" + encodeURIComponent(newPassword);

        try {
            setIsPasswordLoading(true);

            response = await fetch(changePasswordUrl, {
                credentials: "include",
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body
            })

            setIsPasswordLoading(false);

            if (response.ok) {
                userStore.user = null;
                alert(t("passwordChangeSuccess"));
            }
            else {
                console.error(response);
                alert(t("error"));
            }
        } catch (err) {
            setIsPasswordLoading(false);
            console.error(err);
            return;
        }
    };

    const setActiveSettingsPage = pageName => {
        setSettingsPage(pageName);
    }

    const getPageChildren = pageName => {
        const getSecurityPage = () => {
            return (
                <>
                    <div className="field">
                        <label htmlFor="change-password-old">{t("oldPassword")}</label>
                        <input 
                            id="change-password-old"
                            className="input"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            name="change-password-old"
                            type="password" />
                    </div>
                    <div className="field">
                        <label htmlFor="change-password-new">{t("newPassword")}</label>
                        <input 
                            id="change-password-new"
                            className="input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            name="change-password-new"
                            type="password" />
                    </div>
                    <div className="field">
                        <label htmlFor="change-password-new-confirm">{t("newPasswordConfirm")}</label>
                        <input 
                            id="change-password-new-confirm"
                            className="input"
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            name="change-password-new-confirm"
                            type="password" />
                    </div>
                    <div className={"notification is-danger" + (!isInvalidPasswordCombo ? " is-hidden" : "")}>
                        {t("invalidPasswordCombo")}
                    </div>
                    <div className="field">
                        <div className="control">
                            <button
                                type="button"
                                onClick={changePassword}
                                className={"button is-black" + (isPasswordLoading ? " is-loading" : "")}
                            >
                                {t("changePassword")}
                            </button>
                        </div>
                    </div>
                </>
            );
        }

        const getRoomsPage = () => <div>Rooms</div>

        const getDbStatePage = () => <DbStateSetter />
    
        switch (pageName) {
            case "security":
                return getSecurityPage();
            case "rooms":
                return getRoomsPage();
            case "dbStateSetter":
                return getDbStatePage();
            default:
                console.error("Unknown page: " + pageName);
                return;
        }
    }

    let pages = ["security", "rooms"];

    // Add DB state setter page for users with privileges
    pages = canSetDbState(userStore.user.privileges) ? pages.concat("dbStateSetter") : pages;

    const pageNavItems = pages.map(pageName => {
        return (
            <SettingsNavItem
                key={pageName}
                text={t(pageName)}
                pageName={pageName}
                setActiveSettingsPage={setActiveSettingsPage}
            />
        )
    });

    const settingsPages = pages.map(pageName => 
        <SettingsPage
            key={pageName}
            name={pageName}
            isActive={pageName === settingsPage}
            setSettingsPage={setSettingsPage}
        >
            {getPageChildren(pageName)}
        </SettingsPage>
    )

    return (
        <div className="Settings columns">
            <form className="column is-one-third is-offset-one-third">
                <div className="Settings-username field is-grouped">
                    <div className="control is-expanded">
                        <input className="input" disabled type="text" value={userStore.user.fullName}></input>
                    </div>
                    <div className="control">
                        <button
                            type="button"
                            className={"button is-black" + (isLoggingOut ? " is-loading" : "")}
                            onClick={logOut}
                        >
                            {t("logOut")}
                        </button>
                    </div>
                </div>
                <div className={settingsPage ? "is-hidden" : ""}>
                    {pageNavItems}
                </div>
                <div>
                    {settingsPages}
                </div>
                <div className={settingsPage ? "is-hidden" : ""}>{t("buildDate", {buildDate})}</div>
                {/* {JSON.stringify(userStore.userShiftData, null, 2)} */}
            </form>
        </div>
    )
});

const canSetDbState = (privileges) => {
    return privileges.canSetDbState;
}

export default Settings;