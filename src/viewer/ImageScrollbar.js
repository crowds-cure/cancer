import { Component } from 'react';
import React from 'react';
import './ImageScrollbar.css';
import PropTypes from 'prop-types';

class ImageScrollbar extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    onInputCallback: PropTypes.func.isRequired
  };

  render() {
    this.style = {
      width: `${this.props.height}`
    };

    return (
      <div className="scroll">
        <div className="scroll-holder">
          <input
            className="imageSlider"
            style={this.style}
            type="range"
            min="0"
            max={this.props.max}
            step="1"
            value={this.props.value}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }

  onChange = event => {
    const intValue = parseInt(event.target.value, 10);
    this.props.onInputCallback(intValue);
  };
}

export default ImageScrollbar;
