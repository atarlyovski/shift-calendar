import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../../../mobx/userStore';

import DbStateSetter from './DbStateSetter';

const Settings = observer(() => {
    const userStore = useContext(UserStoreContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [isInvalidPasswordCombo, setIsInvalidPasswordCombo] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
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

    let dbStateSetter;

    try {
        let privileges = userStore.user.privileges || {};

        if (privileges.canSetDbState) {
            dbStateSetter = <DbStateSetter />;
        }
    } catch (err) {
        console.error(err)
    }

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
                <div>
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
                    {dbStateSetter}
                </div>
                {/* {JSON.stringify(userStore.userShiftData, null, 2)} */}
            </form>
        </div>
    )
});

export default Settings;