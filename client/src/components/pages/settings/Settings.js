import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../../../mobx/userStore';
import { MiscStoreContext } from '../../../mobx/miscStore';

const Settings = observer(() => {
    const userStore = useContext(UserStoreContext);
    const miscStore = useContext(MiscStoreContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [isInvalidPasswordCombo, setIsInvalidPasswordCombo] = useState(false);
    const { t } = useTranslation();

    const logOut = async () => {
        var logOutURL = '/api/user/logout',
            response;
        
        try {
            response = await fetch(miscStore.serverHost + logOutURL, {
                credentials: "include",
                method: 'post',
                mode: miscStore.serverHost ? 'cors' : 'same-origin',
            });

            if (response.ok) {
                userStore.user = null;
            }
            else {
                console.error(response);
                alert(t("error"));
            }
        } catch (err) {
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
            response = await fetch(miscStore.serverHost + changePasswordUrl, {
                credentials: "include",
                method: 'post',
                mode: miscStore.serverHost ? 'cors' : 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body
            })

            if (response.ok) {
                userStore.user = null;
                alert(t("passwordChangeSuccess"));
            }
            else {
                console.error(response);
                alert(t("error"));
            }
        } catch (err) {
            console.error(err);
            return;
        }
    };

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
                            className="button is-black"
                            onClick={logOut}>
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
                    <div className="control">
                        <button type="button" onClick={changePassword} className="button is-black">{t("changePassword")}</button>
                    </div>
                </div>
                {/* {JSON.stringify(userStore.userShiftData, null, 2)} */}
            </form>
        </div>
    )
});

export default Settings;