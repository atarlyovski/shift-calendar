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
        innerView,
        eventSource;

    const userStore = useContext(UserStoreContext);
    const miscStore = useContext(MiscStoreContext);
    let { t } = useTranslation();

    useEffect(() => {
        if (!userStore.user) {
            return;
        }

        let controller = new AbortController();
        let signal = controller.signal;
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

        return () => {
            controller.abort();
        };
    }, [t, miscStore.serverHost, userStore.user]);

    useEffect(() => {
        function onMessage(message) {
            console.log(message);
            document.title = "Message";
        }

        function onError(err) {
            console.error(err);
        }

        if (userStore.user) {
            eventSource = new EventSource(miscStore.serverHost + '/api/shifts/sse', { withCredentials: true } );
            eventSource.addEventListener('message', onMessage, false);
            eventSource.addEventListener('error', onError, false);
        }

        return function() {
            if (eventSource instanceof EventSource) {
                eventSource.close();
            }
        }
    }, [miscStore.serverHost, userStore.user]);
    
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
