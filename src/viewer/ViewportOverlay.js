import { Component } from 'react';
import React from 'react';
import './ViewportOverlay.css';
import * as cornerstone from 'cornerstone-core';
import PropTypes from 'prop-types';

class ViewportOverlay extends Component {
  render() {
    // TODO: Round the value to 2 decimals
    const scale = this.props.viewport.scale;
    const imageId = this.props.imageId;

    const patientId = cornerstone.metaData.get('00100020', imageId);
    const studyDate = cornerstone.metaData.get('00080020', imageId);
    const collection = cornerstone.metaData.get('00131010', imageId);
    const studyDescription = cornerstone.metaData.get('00081030', imageId);

    const windowWidth = Math.round(this.props.viewport.voi.windowWidth);
    const windowCenter = Math.round(this.props.viewport.voi.windowCenter);

    return (
      <div className="ViewportOverlay">
        <div className="top-left overlay-element">
          <span>{collection}</span>
          <span>{patientId}</span>
          <span>{studyDate}</span>
          <span>{studyDescription}</span>
        </div>
        <div className="top-right overlay-element">Other info</div>
        <div className="bottom-left overlay-element">Zoom: {scale}</div>
        <div className="bottom-right overlay-element">
          <span>
            WW/WC: {windowWidth} / {windowCenter}
          </span>
          <span>
            Image: {this.props.stack.currentImageIdIndex + 1} /{' '}
            {this.props.stack.imageIds.length}
          </span>
        </div>
      </div>
    );
  }
}

ViewportOverlay.propTypes = {
  viewport: PropTypes.object.isRequired,
  imageId: PropTypes.string.isRequired,
  stack: PropTypes.object.isRequired
};

export default ViewportOverlay;
