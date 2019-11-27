import { Component } from 'react';
import React from 'react';
import './ViewportOverlay.css';
import * as cornerstone from 'cornerstone-core';
import PropTypes from 'prop-types';

class ViewportOverlay extends Component {
  render() {
    const {
      roundedViewportScale,
      imageId,
      viewportVoi,
      stack,
      numImagesLoaded
    } = this.props;

    const patientId = cornerstone.metaData.get('00100020', imageId);
    const studyDate = cornerstone.metaData.get('00080020', imageId);
    const collection = cornerstone.metaData.get('00131010', imageId);
    const studyDescription = cornerstone.metaData.get('00081030', imageId);

    const windowWidth = Math.round(viewportVoi.windowWidth);
    const windowCenter = Math.round(viewportVoi.windowCenter);
    const imagesLeft = stack.imageIds.length - numImagesLoaded;

    return (
      <div className="ViewportOverlay">
        <div className="top-left overlay-element">
          <span>{collection}</span>
          <span>{patientId}</span>
          <span>{studyDate}</span>
          <span>{studyDescription}</span>
          <span className="loadingProgress">
            {imagesLeft > 0 ? `${imagesLeft} images remaining...` : ''}
          </span>
        </div>
        <div className="bottom-left overlay-element">
          Zoom: {roundedViewportScale}
        </div>
        <div className="bottom-right overlay-element">
          <span>
            WW/WC: {windowWidth} / {windowCenter}
          </span>
          <span>
            Image: {stack.currentImageIdIndex + 1} / {stack.imageIds.length}
          </span>
        </div>
      </div>
    );
  }
}

ViewportOverlay.propTypes = {
  viewportVoi: PropTypes.object.isRequired,
  roundedViewportScale: PropTypes.number.isRequired,
  imageId: PropTypes.string.isRequired,
  stack: PropTypes.object.isRequired
};

export default ViewportOverlay;
