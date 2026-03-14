import React from 'react';
import { getImageURL } from '../utils/fetchData';
import { useUEProps } from '../helpers';

const ImageBlock = ({ image, altText, caption, _path, isPreview }) => {
    const ue = useUEProps(_path, 'Image');
    const imageUrl = getImageURL(image);
    const hasData = !!imageUrl;

    return (
        <figure className="ue-image" {...ue.container()}>
            {!hasData && !isPreview ? (
                <div className="ue-placeholder">
                    <p>Image — Click to add</p>
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
