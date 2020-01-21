import React, { Suspense, useContext } from 'react';
import Navigator from './Navigator';
import './App.css';
import ViewContainer from './ViewContainer';
import LoginForm from './LoginForm';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../mobx/userStore';

const App = observer(() => {
    let loginForm,
        innerView;

    const userStore = useContext(UserStoreContext);
    
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
