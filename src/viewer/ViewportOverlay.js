import { Component } from 'react';
import React from 'react';
import './ViewportOverlay.css';

class ViewportOverlay extends Component {
  render() {
    // TODO: Round the value to 2 decimals
    const scale = this.props.viewport.scale;

    const windowWidth = Math.round(this.props.viewport.voi.windowWidth);
    const windowCenter = Math.round(this.props.viewport.voi.windowCenter);

    return (
      <div className="ViewportOverlay">
        <div className="top-left overlay-element">Patient</div>
        <div className="top-right overlay-element">Other info</div>
        <div className="bottom-left overlay-element">Zoom: {scale}</div>
        <div className="bottom-right overlay-element">
          WW/WC: {windowWidth} / {windowCenter}
        </div>
      </div>
    );
  }
}

export default ViewportOverlay;
