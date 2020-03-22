import React, { Suspense, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from '../moment-with-locales.custom';

import Navigator from './Navigator';
import './App.css';
import ViewContainer from './ViewContainer';
import LoginForm from './LoginForm';
import OfflineBanner from './OfflineBanner';
import { usePageVisibility } from '../hooks/usePageVisibility';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../mobx/userStore';

const App = observer(() => {
    let loginForm,
        innerView;

    let [lastUpdated, setLastUpdated] = useState(null);
    let [isInitialized, setIsInitialized] = useState(false); // whether or not we have data to show
    let isPageVisible = usePageVisibility();
    const userStore = useContext(UserStoreContext);
    let { t } = useTranslation();

    useEffect(() => {
        const updateIntervalMs = 1 * 60 * 60 * 1000;

        const fetchData = (signal) => {
            if (!userStore.user) {
                return;
            }

            if (!isPageVisible) {
                return;
            }

            if (lastUpdated && lastUpdated > moment().subtract(updateIntervalMs)) {
                return;
            }
    
            let userShiftDataURL = '/api/shifts/data';
            let response;
    
            (async () => {
                try {
                    response = await fetch(userShiftDataURL, {
                        credentials: "include",
                        signal
                    });
    
                    if (response.ok) {
                        let result = await response.json();
                        userStore.userShiftData = result;
                    } else {
                        console.error(response);
                        alert(t("error"));
                    }
                    
                    setLastUpdated(moment());
                    setIsInitialized(true);
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

        let fetchDataInterval = setInterval(() => {
            controller = new AbortController();
            signal = controller.signal;

            fetchData(signal);
        }, updateIntervalMs);

        return () => {
            controller.abort();
            clearInterval(fetchDataInterval);
        };
    }, [t, userStore.user, isPageVisible, lastUpdated]);
    
    if (!userStore.user) {
        loginForm = <LoginForm />
    } else {
        innerView = (
            <div className="innerView">
                {
                    isInitialized ?
                    (<>
                        <ViewContainer />
                        <Navigator />
                    </>) : false
                }
            </div>
        )
    }

    return (
        <div className="App">
            <Suspense fallback="loading">
                {loginForm}
                {innerView}
            </Suspense>
            <OfflineBanner />
        </div>
    );
})

export default App;
