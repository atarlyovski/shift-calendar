import { useState, useEffect } from 'react';

export function useNavigatorOnline() {
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);
    const onOnlineOffline = () => setIsOnline(window.navigator.onLine);

    useEffect(() => {
        window.addEventListener("online", onOnlineOffline, false);
        window.addEventListener("offline", onOnlineOffline, false);

        return () => {
            window.removeEventListener("online", onOnlineOffline);
            window.removeEventListener("offline", onOnlineOffline);
        };
    });

    return isOnline;
}