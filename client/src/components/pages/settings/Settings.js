import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../../../mobx/userStore';
import { MiscStoreContext } from '../../../mobx/miscStore';

const Settings = observer(() => {
    const userStore = useContext(UserStoreContext);
    const miscStore = useContext(MiscStoreContext);
    const { t } = useTranslation();

    const logOut = async () => {
        var logOutURL = '/api/user/logout',
            response;

        try {
            response = await fetch(miscStore.serverHost + logOutURL, {
                credentials: "include",
                method: 'post',
                mode: 'cors'
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

    return (
        <div className="Settings">
            <div className="Settings-username">
                {userStore.user.fullName}
                <button
                    className="pure-button"
                    onClick={logOut}>
                    {t("logOut")}
                </button>
            </div>
        </div>
    )
});

export default Settings;