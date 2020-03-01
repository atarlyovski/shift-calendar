import { useState, useEffect } from 'react';

export function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(!document.hidden);
    const onVisibilityChange = () => setIsVisible(!document.hidden);

    useEffect(() => {
        window.addEventListener("visibilitychange", onVisibilityChange, false);

        return () => {
            window.removeEventListener("visibilitychange", onVisibilityChange);
        };
    });

    return isVisible;
}