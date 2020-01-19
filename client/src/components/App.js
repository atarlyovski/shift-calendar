import React, { Suspense } from 'react';
import Navigator from './Navigator';
import './App.css';
import ViewContainer from './ViewContainer';
import LoginForm from './LoginForm';

function App({ user }) {
    let loginForm,
        innerView;
    
    if (!user) {
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
}

export default App;
