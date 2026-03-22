import React from 'react';
import { useUEProps } from '../helpers';

const CTA = ({ label, url, variant, _path, isPreview }) => {
    const ue = useUEProps(_path, 'Call to Action');
    const hasData = !!(label || url);
    const buttonClass = `ue-cta-button ${variant === 'secondary' ? 'secondary' : 'primary'}`;

    return (
        <div className="ue-cta" {...ue.container()}>
            <div className="ue-component-bar">
                <span className="ue-component-bar__icon">→</span>
                <span className="ue-component-bar__type">CTA</span>
                {label && <span className="ue-component-bar__detail">{label}</span>}
            </div>
            {!hasData && !isPreview ? (
                <div className="ue-placeholder">
                    <p>Click to add a button label and URL</p>
                </div>
            ) : (
                <a
                    href={url || '#'}
                    className={buttonClass}
                    target={url?.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer">
                    <span {...ue.prop('label', 'text')}>{label || 'Click here'}</span>
                </a>
            )}
        </div>
    );
};

export default CTA;
