import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import './LoginForm.css';
// import '../translations/i18n';
// import '../translations/translations'

// import store from '../redux/store';
// import { setUser } from '../redux/actions';

function LoginForm() {
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
            response = await fetch(serverHost + loginUrl, {
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
            } else if (!result.success) {
                setValidationMessages({
                    // common: "The user name or password is incorrect."
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

    let { t } = useTranslation();

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

    let serverHost = "http://localhost:3001";
    // let serverHost = useSelector(state => (
    //     state.serverHost
    // ));

    return (
        <form className="LoginForm pure-form">
            <div className="form-group">
                <input
                    type="text"
                    name="username"
                    placeholder={t("username")}
                    onChange={onInputChange}/>
            </div>
            <div className="form-group">
                <input
                    type="password"
                    name="password"
                    placeholder={t("password")}
                    onChange={onInputChange}/>
            </div>
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
                className="btn"
                type="submit"
                onClick={onLoginClick}
                disabled={isInProgress}>
                    {isInProgress ? t("pleaseWait") : t("login")}
            </button>
        </form>
    )
}

export default LoginForm;