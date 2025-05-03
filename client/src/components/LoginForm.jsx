import React, { useState, useContext } from 'react';
// import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import './LoginForm.css';
// import '../translations/i18n';
// import '../translations/translations'

// import store from '../redux/store';
// import { setUser } from '../redux/actions';
// import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../mobx/userStore';
import { useUserData } from '../hooks/useUserData';

const LoginForm = () => {
    const userStore = useContext(UserStoreContext);

    const [{ isLoading }] =
        useUserData(userStore.user);

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
            response = await fetch(loginUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            })
    
            setIsInProgress(false);
            result = await response.json();
    
            if (response.ok && result.success) {
                // store.dispatch(setUser(result.user));
                userStore.user = result.user;
            } else if (!result.success) {
                setValidationMessages({
                    common: t("invalidCredentials")
                })
            }
        } catch (err) {
            setIsInProgress(false);
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
        <div className={"LoginForm columns is-centered" + (isLoading ? " is-hidden" : "")}>
            <div className="column is-one-third">
                <div className="LoginForm-logo">
                    <img src="a_shift_calendar.svg" alt="logo"/>
                    <h1 className="title is-4">A Shift Calendar</h1>
                </div>
                <form className="">
                    <div className="field">
                        <label
                            htmlFor="LoginForm-username">
                            {t("username")}
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="input"
                            id="LoginForm-username"
                            placeholder={t("username")}
                            onChange={onInputChange}/>
                    </div>
                    <div className="field">
                        <label
                            htmlFor="LoginForm-password">
                            {t("password")}
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="input"
                            id="LoginForm-password"
                            placeholder={t("password")}
                            onChange={onInputChange}/>
                    </div>
                    <div className={"notification is-danger" + (!validationMessages.username ? " is-hidden" : "")}>
                        {validationMessages.username}
                    </div>
                    <div className={"notification is-danger" + (!validationMessages.password ? " is-hidden" : "")}>
                        {validationMessages.password}
                    </div>
                    <div className={"notification is-danger" + (!validationMessages.common ? " is-hidden" : "")}>
                        {validationMessages.common}
                    </div>
                    <div className="field">
                        <button
                            className={"button is-black" + (isInProgress ? " is-loading" : "")}
                            type="submit"
                            onClick={onLoginClick}
                        >
                            {t("login")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;