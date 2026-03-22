import React from 'react';
import { useUEProps } from '../helpers';

const Title = ({ title, _path, isPreview }) => {
    const ue = useUEProps(_path, 'Title');
    const hasData = !!title;

    return (
        <div className="ue-title" {...ue.container()}>
            {!isPreview && (
                <div className="ue-component-bar">
                    <span className="ue-component-bar__icon">T</span>
                    <span className="ue-component-bar__type">Title</span>
                    {title && <span className="ue-component-bar__detail">{title}</span>}
                </div>
            )}
            {!hasData && !isPreview ? (
                <div className="ue-placeholder">
                    <p>Click to add a title</p>
                </div>
            ) : (
                <h3 {...ue.prop('title', 'text')}>{title || 'Untitled'}</h3>
            )}
        </div>
    );
};

export default Title;
