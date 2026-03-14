/**
 * AEM connection utilities.
 * Reads config from URL search params (for UE iframe) or from .env.
 */

export const getAuthorHost = () => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    if (searchParams.has("authorHost")) {
        return searchParams.get("authorHost");
    } else if (import.meta.env.VITE_AUTHOR_HOST) {
        return import.meta.env.VITE_AUTHOR_HOST;
    } else {
        return "https://author-p181502-e1907767.adobeaemcloud.com";
    }
};

export const getImageURL = (obj) => {
    if (obj === null || obj === undefined) {
        return undefined;
    }

    if (typeof obj === "string") {
        if (obj.startsWith("https://")) {
            return obj;
        }
        return `${getAuthorHost()}${obj}`;
    }

    if (obj._authorUrl !== undefined) {
        return obj._authorUrl;
    }

    if (obj.repositoryId !== undefined && obj.assetId !== undefined) {
        return `https://${obj.repositoryId}/adobe/assets/${obj.assetId}`;
    }

    if (obj._path !== undefined) {
        return `${getAuthorHost()}${obj._path}`;
    }

    return undefined;
};

export const getProtocol = () => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    if (searchParams.has("protocol")) {
        return searchParams.get("protocol");
    } else {
        return "aem";
    }
};

export const getService = () => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    if (searchParams.has("service")) {
        return searchParams.get("service");
    }
    return null;
};
