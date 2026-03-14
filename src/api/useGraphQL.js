/**
 * Custom React Hook to perform AEM GraphQL persisted queries.
 * Includes UE event listeners for auto-refresh after content edits.
 */
import { useState, useEffect } from 'react';
import { getAuthorHost } from '../utils/fetchData';
import { AEMHeadless } from '@adobe/aem-headless-client-js';

function useGraphQL(path) {
    const [data, setData] = useState(null);
    const [errorMessage, setErrors] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0);

    // Listen for Universal Editor content updates to trigger re-fetch
    useEffect(() => {
        const handleContentUpdate = () => {
            setRefreshCount(c => c + 1);
        };

        document.addEventListener('aue:content-patch', handleContentUpdate);
        document.addEventListener('aue:content-update', handleContentUpdate);
        document.addEventListener('editor-update', handleContentUpdate);

        return () => {
            document.removeEventListener('aue:content-patch', handleContentUpdate);
            document.removeEventListener('aue:content-update', handleContentUpdate);
            document.removeEventListener('editor-update', handleContentUpdate);
        };
    }, []);

    useEffect(() => {
        function makeRequest() {
            const sdk = new AEMHeadless({
                serviceURL: getAuthorHost(),
                endpoint: "/content/graphql/global/endpoint.json",
            });
            const request = sdk.runPersistedQuery.bind(sdk);

            request(path, {}, { credentials: "include", cache: "no-store" })
                .then(({ data, errors }) => {
                    if (errors) {
                        setErrors(mapErrors(errors));
                    }
                    if (data) {
                        setData(data);
                    }
                })
                .catch((error) => {
                    setErrors(error);
                    sessionStorage.removeItem('accessToken');
                });
        }

        makeRequest();
    }, [path, refreshCount]);

    return { data, errorMessage };
}

function mapErrors(errors) {
    return errors.map((error) => error.message).join(",");
}

export default useGraphQL;
