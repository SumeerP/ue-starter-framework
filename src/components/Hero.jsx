import React from 'react';
import { getImageURL } from '../utils/fetchData';
import { useUEProps } from '../helpers';

const Hero = ({ title, image, _path, isPreview }) => {
    const ue = useUEProps(_path, 'Hero');
    const imageUrl = getImageURL(image);
    const hasData = !!(title || imageUrl);

    return (
        <div className={`ue-hero${imageUrl ? ' has-image' : ''}`} {...ue.container()}>
            {!hasData && !isPreview ? (
                <div className="ue-placeholder">
                    <p>Hero Component — Add title and image</p>
                </div>
            ) : (
                <>
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={title || 'Hero image'}
                            className="ue-hero-image"
                            {...ue.prop('image', 'media')}
                        />
                    )}
                    <div className="ue-hero-text">
                        <h2 {...ue.prop('title', 'text')}>{title || 'Untitled'}</h2>
                    </div>
                </>
            )}
        </div>
    );
};

export default Hero;
