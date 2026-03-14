/**
 * PageContainer — Generic, configurable container for rendering AEM Content Fragment pages.
 *
 * Props:
 *   - query: Persisted query path (e.g., 'vyingdigitalpartnersandboxprogram/homepage')
 *   - queryKey: GraphQL response key (e.g., 'homepageList')
 *   - fragmentPath: Specific CF path to render (optional — uses first item if not set)
 *   - label: UE display label
 */
import React, { useEffect, useState } from 'react';
import useGraphQL from '../api/useGraphQL';
import { resolveComponent, useIsPreview } from '../helpers';
import '../styles/components.scss';

const PageContainer = ({ query, queryKey, fragmentPath, label = 'Page Container' }) => {
    const { data, errorMessage } = useGraphQL(query);
    const [containerItem, setContainerItem] = useState(null);
    const isPreview = useIsPreview();

    useEffect(() => {
        if (data) {
            const responseData = data[queryKey];
            const items = responseData?.items;
            if (items && items.length > 0) {
                const item = fragmentPath
                    ? items.find(i => i._path === fragmentPath) || items[0]
                    : items[0];
                setContainerItem(item);
            }
        }
    }, [data, queryKey, fragmentPath]);

    if (errorMessage) return <div className="ue-container ue-error">Error: {errorMessage}</div>;
    if (!data) return <div className="ue-container ue-loading">Loading...</div>;
    if (!containerItem) return <div className="ue-container">No data found</div>;

    return (
        <div
            className="ue-container"
            data-aue-resource={`urn:aemconnection:${containerItem._path}/jcr:content/data/master`}
            data-aue-type="reference"
            data-aue-label={label}
            data-aue-filter="cf">

            {containerItem.title && (
                <div className="ue-container-header">
                    <h1 data-aue-prop="title" data-aue-type="text">{containerItem.title}</h1>
                </div>
            )}

            <div
                className="ue-references"
                data-aue-prop="references"
                data-aue-type="container"
                data-aue-label="Components">
                {(!containerItem.references || containerItem.references.length === 0) && !isPreview && (
                    <div className="ue-placeholder">
                        <p>No components added yet. Use the Universal Editor to add content.</p>
                    </div>
                )}
                {containerItem.references && containerItem.references.map((ref, index) => {
                    if (!ref) return null;

                    const Component = resolveComponent(ref);

                    if (Component) {
                        return <Component key={index} {...ref} isPreview={isPreview} />;
                    }

                    const modelTitle = ref._model?.title || ref.__typename || 'Unknown';
                    return (
                        <div key={index} className="ue-placeholder">
                            Unknown component: {modelTitle}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PageContainer;
