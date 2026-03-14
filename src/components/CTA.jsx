import React from 'react';
import { useUEProps } from '../helpers';

const CTA = ({ label, url, variant, _path, isPreview }) => {
    const ue = useUEProps(_path, 'Call to Action');
    const hasData = !!(label || url);
    const buttonClass = `ue-cta-button ${variant === 'secondary' ? 'secondary' : 'primary'}`;

    return (
        <div className="ue-cta" {...ue.container()}>
            {!hasData && !isPreview ? (
                <div className="ue-placeholder">
                    <p>CTA — Add label and URL</p>
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
