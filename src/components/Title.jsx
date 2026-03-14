import React from 'react';
import { useUEProps } from '../helpers';

const Title = ({ title, _path, isPreview }) => {
    const ue = useUEProps(_path, 'Title');
    const hasData = !!title;

    return (
        <div className="ue-title" {...ue.container()}>
            {!hasData && !isPreview ? (
                <div className="ue-placeholder">
                    <p>Title Component — Click to edit</p>
                </div>
            ) : (
                <h3 {...ue.prop('title', 'text')}>{title || 'Untitled'}</h3>
            )}
        </div>
    );
};

export default Title;
