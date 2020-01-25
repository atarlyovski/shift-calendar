import React, { useState, useContext, useEffect } from 'react';
// import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import './LoginForm.css';
// import '../translations/i18n';
// import '../translations/translations'

// import store from '../redux/store';
// import { setUser } from '../redux/actions';
// import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../mobx/userStore';
import { MiscStoreContext } from '../mobx/miscStore';

const LoginForm = () => {
    const userStore = useContext(UserStoreContext);
    const miscStore = useContext(MiscStoreContext);

    let { t } = useTranslation();

    const onLoginClick = async (event) => {
        var loginUrl = "/api/user/login",
            response,
            result;
    
        event.preventDefault();
    
        setValidationMessages({
            username: "",
            password: "",
            common: ""
        })
    
        if (!inputsAreValid(formData.username, formData.password)) {
            return;
        }
    
        let body = "username=" + encodeURIComponent(formData.username);
        body += "&password=" + encodeURIComponent(formData.password);
    
        setIsInProgress(true);
    
        try {
            response = await fetch(miscStore.serverHost + loginUrl, {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            })
    
            result = await response.json();
    
            setIsInProgress(false);
    
            if (response.ok && result.success) {
                // store.dispatch(setUser(result.user));
                userStore.user = result.user;
            } else if (!result.success) {
                setValidationMessages({
                    common: t("invalidCredentials")
                })
            }
        } catch (err) {
            console.error(err);
        }
    }

    const inputsAreValid = (username, password) => {
        var usernamePattern = /^[a-zA-Z0-9_]*$/,
            areAllValid = true;

        if (!username || !usernamePattern.test(username)) {
            setValidationMessages({
                // username: "Please enter a username with only alphanumeric characters!"
                username: t("invalidUsername")
            })

            areAllValid = false
        }

        if (!password) {
            setValidationMessages({
                // password: "Please enter a password!"
                password: t("invalidPassword")
            })

            areAllValid = false
        }

        return areAllValid;
    }

    const onInputChange = (event) => {
        formData[event.target.getAttribute("name")] = event.target.value;
        setFormData(formData);
    }

    useEffect(() => {
        async function fetchData() {
            var user,
                response,
                userDataUrl = '/api/user/userData';

            try {
                response = await fetch(miscStore.serverHost + userDataUrl, {
                    credentials: "include",
                    mode: 'cors'
                });
    
                if (response.ok) {
                    user = await response.json();
    
                    if (!user || !user.username) {
                        user = null;
                    }
                } else {
                    user = null;
                }
            } catch (err) {
                console.error(err);
                return;
            }

            // store.dispatch(setUser(user));
            userStore.user = user;
        }

        fetchData();
    }, [miscStore.serverHost, userStore.user]);

    let [isInProgress, setIsInProgress] = useState(false);

    let [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    let [validationMessages, setValidationMessages] = useState({
        username: "",
        password: "",
        common: ""
    });

    return (
        <div className="LoginForm pure-g">
            <div className="pure-u-0 pure-u-md-1-4 pure-u-lg-1-3"></div>
            <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-3">
                <form className="pure-form pure-form-stacked">
                    <label
                        htmlFor="LoginForm-username">
                        {t("username")}
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="LoginForm-username"
                        placeholder={t("username")}
                        onChange={onInputChange}/>
                    <label
                        htmlFor="LoginForm-password">
                        {t("password")}
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="LoginForm-password"
                        placeholder={t("password")}
                        onChange={onInputChange}/>
                    <div className="alert alert-danger">
                        {validationMessages.username}
                    </div>
                    <div className="alert alert-danger">
                        {validationMessages.password}
                    </div>
                    <div className="alert alert-danger">
                        {validationMessages.common}
                    </div>
                    <button
                        className="pure-button"
                        type="submit"
                        onClick={onLoginClick}
                        disabled={isInProgress}>
                            {isInProgress ? t("pleaseWait") : t("login")}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;