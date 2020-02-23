import React, { Suspense, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Navigator from './Navigator';
import './App.css';
import ViewContainer from './ViewContainer';
import LoginForm from './LoginForm';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../mobx/userStore';
import { MiscStoreContext } from '../mobx/miscStore';

const App = observer(() => {
    let loginForm,
        innerView;

    const userStore = useContext(UserStoreContext);
    const miscStore = useContext(MiscStoreContext);
    let { t } = useTranslation();

    useEffect(() => {
        const fetchData = (signal) => {
            if (!userStore.user) {
                return;
            }
    
            let userShiftDataURL = '/api/shifts/data';
            let response;
    
            (async () => {
                try {
                    response = await fetch(miscStore.serverHost + userShiftDataURL, {
                        credentials: "include",
                        mode: 'cors',
                        signal
                    });
    
                    if (response.ok) {
                        let result = await response.json();
                        userStore.userShiftData = result;
                    } else {
                        console.error(response);
                        alert(t("error"));
                    }
                } catch (err) {
                    console.error(err);
                    return;
                }
            })();
        };

        if (!userStore.user) {
            return;
        }

        let controller = new AbortController();
        let signal = controller.signal;

        fetchData(signal);

        let fetchDataInterval = setInterval(fetchData, 1 * 60 * 60 * 1000);

        return () => {
            controller.abort();
            clearInterval(fetchDataInterval);
        };
    }, [t, miscStore.serverHost, userStore.user]);
    
    if (!userStore.user) {
        loginForm = <LoginForm />
    } else {
        innerView = (
            <div className="innerView">
                <ViewContainer />
                <Navigator />
            </div>
        )
    }

    return (
        <div className="App">
            <Suspense fallback="loading">
                {loginForm}
                {innerView}
            </Suspense>
        </div>
    );
})

export default App;
