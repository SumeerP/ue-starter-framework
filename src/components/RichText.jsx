import React from 'react';
import { useUEProps } from '../helpers';

const RichText = ({ text, _path, isPreview }) => {
    const ue = useUEProps(_path, 'Rich Text');
    const hasData = !!text;

    return (
        <div className="ue-richtext" {...ue.container()}>
            {!hasData && !isPreview ? (
                <div className="ue-placeholder">
                    <p>Rich Text — Click to edit</p>
                </div>
            ) : (
                <div
                    className="ue-richtext-content"
                    {...ue.prop('text', 'richtext')}
                    dangerouslySetInnerHTML={{ __html: text || '' }}
                />
            )}
        </div>
    );
};

export default RichText;
