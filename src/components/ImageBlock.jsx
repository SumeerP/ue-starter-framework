import React from 'react';
import { getImageURL } from '../utils/fetchData';
import { useUEProps } from '../helpers';

const ImageBlock = ({ image, altText, caption, _path, isPreview }) => {
    const ue = useUEProps(_path, 'Image');
    const imageUrl = getImageURL(image);
    const hasData = !!imageUrl;

    return (
        <figure className="ue-image" {...ue.container()}>
            {!isPreview && (
                <div className="ue-component-bar">
                    <span className="ue-component-bar__icon">▣</span>
                    <span className="ue-component-bar__type">Image</span>
                    {altText && <span className="ue-component-bar__detail">{altText}</span>}
                </div>
            )}
            {!hasData && !isPreview ? (
                <div className="ue-placeholder">
                    <p>Click to add an image</p>
                </div>
            ) : (
                <>
                    <img
                        src={imageUrl}
                        alt={altText || ''}
                        className="ue-image-img"
                        {...ue.prop('image', 'media')}
                    />
                    {caption && (
                        <figcaption
                            className="ue-image-caption"
                            {...ue.prop('caption', 'text')}>
                            {caption}
                        </figcaption>
                    )}
                </>
            )}
        </figure>
    );
};

export default ImageBlock;
