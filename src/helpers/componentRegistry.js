/**
 * Component Registry
 *
 * Maps AEM Content Fragment model names to React components.
 * AEM controls composition rules (via CF model definitions).
 * This registry handles presentation: "given a model, render this component."
 *
 * Matching order:
 *   1. Last segment of _model._path (e.g., ".../models/hero" → "hero")
 *   2. _model.title in lowercase (e.g., "Hero" → "hero")
 *   3. Field-signature fallback (when _model is not returned by AEM)
 *
 * To add a new component:
 *   1. Create the component file (e.g., Banner.jsx)
 *   2. Import it here
 *   3. Add one entry: 'banner': Banner
 */
import Hero from '../components/Hero';
import Title from '../components/Title';
import RichText from '../components/RichText';
import ImageBlock from '../components/ImageBlock';
import CTA from '../components/CTA';
import ColumnLayout from '../components/ColumnLayout';

const COMPONENT_MAP = {
    'hero': Hero,
    'title': Title,
    'richtext': RichText,
    'imageblock': ImageBlock,
    'image': ImageBlock,
    'cta': CTA,
    'columnlayout': ColumnLayout,
};

/**
 * Resolve which React component to render for an AEM Content Fragment reference.
 */
export const resolveComponent = (ref) => {
    const modelPath = ref._model?._path || '';
    const modelName = modelPath.split('/').pop().toLowerCase();

    // 1. Match by model path suffix
    if (modelName && COMPONENT_MAP[modelName]) {
        return COMPONENT_MAP[modelName];
    }

    // 2. Match by model title
    const modelTitle = (ref._model?.title || '').toLowerCase();
    if (modelTitle && COMPONENT_MAP[modelTitle]) {
        return COMPONENT_MAP[modelTitle];
    }

    // 3. Fallback: match by field signature when _model is not returned
    if ('layout' in ref && 'column1' in ref) return COMPONENT_MAP['columnlayout'];
    if ('image' in ref && 'title' in ref) return COMPONENT_MAP['hero'];
    if ('image' in ref && !('title' in ref)) return COMPONENT_MAP['image'];
    if ('url' in ref && 'label' in ref) return COMPONENT_MAP['cta'];
    if ('text' in ref && !('title' in ref)) return COMPONENT_MAP['richtext'];
    if ('title' in ref) return COMPONENT_MAP['title'];

    return null;
};

export { COMPONENT_MAP };
