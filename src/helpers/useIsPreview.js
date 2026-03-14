/**
 * useIsPreview — Detects if the page is in preview mode (not inside Universal Editor).
 *
 * Returns true when the app is loaded directly (window.self === window.top).
 * Returns false when loaded inside the UE iframe.
 */
import { useMemo } from 'react';

const useIsPreview = () => {
    return useMemo(() => {
        try {
            return window.self === window.top;
        } catch (e) {
            return false;
        }
    }, []);
};

export default useIsPreview;
