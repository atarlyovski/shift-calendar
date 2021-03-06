import { useState, useEffect, useContext } from 'react';
import { UserStoreContext } from '../mobx/userStore';

export const useUserData = (user) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const userStore = useContext(UserStoreContext);

    useEffect(() => {
        let controller = new AbortController();
        let signal = controller.signal;

        async function fetchData(signal) {
            var user,
                response,
                userDataUrl = '/api/user/userData';

            setIsLoading(true);
            setIsError(false);

            try {
                response = await fetch(userDataUrl, {
                    credentials: "include",
                    signal
                });
    
                if (response.ok) {
                    user = await response.json();
    
                    if (!user || !user.username) {
                        user = null;
                    }
                } else {
                    user = null;
                }

                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setIsLoading(false);
                setIsError(true);

                return;
            }

            // store.dispatch(setUser(user));
            userStore.user = user;
        }

        fetchData(signal);

        return () => {
            controller.abort();
        }
    }, [user]);

    return [{ isLoading, isError }];
}