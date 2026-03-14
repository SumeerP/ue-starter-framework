import React from 'react';
import { resolveComponent } from '../helpers/componentRegistry';

/**
 * Layout configurations.
 * Key = layout enum value from AEM. Value = column count + CSS grid template.
 */
const LAYOUTS = {
    '2-col-equal': { count: 2, grid: '1fr 1fr' },
    '2-col-wide-left': { count: 2, grid: '2fr 1fr' },
    '2-col-wide-right': { count: 2, grid: '1fr 2fr' },
    '2-col-70-30': { count: 2, grid: '7fr 3fr' },
    '2-col-30-70': { count: 2, grid: '3fr 7fr' },
    '3-col-equal': { count: 3, grid: '1fr 1fr 1fr' },
    '3-col-wide-center': { count: 3, grid: '1fr 2fr 1fr' },
    '3-col-wide-left': { count: 3, grid: '2fr 1fr 1fr' },
    '3-col-wide-right': { count: 3, grid: '1fr 1fr 2fr' },
};

const DEFAULT_LAYOUT = LAYOUTS['2-col-equal'];

const Column = ({ references, columnProp, columnIndex, _path, isPreview }) => {
    const hasContent = references && references.length > 0;

    return (
        <div
            className="ue-column"
            data-aue-resource={`urn:aemconnection:${_path}/jcr:content/data/master`}
            data-aue-prop={columnProp}
            data-aue-type="container"
            data-aue-label={`Column ${columnIndex}`}>
            {!hasContent && !isPreview && (
                <div className="ue-placeholder">
                    <p>Column {columnIndex} — Drop components here</p>
                </div>
            )}
            {hasContent && references.map((ref, index) => {
                if (!ref) return null;
                const Component = resolveComponent(ref);
                if (Component) {
                    return <Component key={index} {...ref} isPreview={isPreview} />;
                }
                const modelTitle = ref._model?.title || 'Unknown';
                return <div key={index} className="ue-placeholder">Unknown: {modelTitle}</div>;
            })}
        </div>
    );
};

const ColumnLayout = ({ layout, column1, column2, column3, _path, isPreview }) => {
    const config = LAYOUTS[layout] || DEFAULT_LAYOUT;

    const allColumns = [
        { refs: column1, prop: 'column1', index: 1 },
        { refs: column2, prop: 'column2', index: 2 },
        { refs: column3, prop: 'column3', index: 3 },
    ];
    const activeColumns = allColumns.slice(0, config.count);

    return (
        <div
            className={`ue-column-layout col-${config.count}`}
            style={{ gridTemplateColumns: config.grid }}
            data-aue-resource={`urn:aemconnection:${_path}/jcr:content/data/master`}
            data-aue-type="reference"
            data-aue-filter="cf"
            data-aue-label={`${config.count}-Column Layout (${layout || 'default'})`}>
            {activeColumns.map((col) => (
                <Column
                    key={col.prop}
                    references={col.refs}
                    columnProp={col.prop}
                    columnIndex={col.index}
                    _path={_path}
                    isPreview={isPreview}
                />
            ))}
        </div>
    );
};

export default ColumnLayout;
