/**
 * useUEProps — Thin helper that generates official data-aue-* attributes.
 *
 * This does NOT replace Adobe's instrumentation — it returns the exact same
 * attributes you'd write manually. Use raw attributes if you prefer.
 *
 * Usage:
 *   const ue = useUEProps(_path, 'Hero');
 *   <div {...ue.container()}>
 *     <h2 {...ue.prop('title', 'text')}>{title}</h2>
 *     <img {...ue.prop('image', 'media')} src={...} />
 *   </div>
 */
import { useMemo } from 'react';
import useIsPreview from './useIsPreview';

const useUEProps = (_path, label) => {
    const isPreview = useIsPreview();

    return useMemo(() => ({
        isPreview,

        /**
         * Returns data-aue-* attributes for the component's container element.
         * @param {Object} options - Override defaults
         * @param {string} options.type - data-aue-type (default: 'reference')
         * @param {string} options.filter - data-aue-filter (default: 'cf')
         */
        container: (options = {}) => ({
            'data-aue-resource': `urn:aemconnection:${_path}/jcr:content/data/master`,
            'data-aue-type': options.type || 'reference',
            'data-aue-filter': options.filter || 'cf',
            'data-aue-label': label,
        }),

        /**
         * Returns data-aue-* attributes for an editable property.
         * @param {string} name - Property name (e.g., 'title')
         * @param {string} type - UE type: 'text', 'richtext', 'media', 'container', etc.
         */
        prop: (name, type) => ({
            'data-aue-prop': name,
            'data-aue-type': type,
        }),
    }), [_path, label, isPreview]);
};

export default useUEProps;
