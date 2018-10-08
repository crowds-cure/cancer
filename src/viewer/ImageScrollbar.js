import { Component } from 'react';
import React from 'react';
import './ImageScrollbar.css';

class ImageScrollbar extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      value: 0
    };

    this.onInputCallback = this.props.onInputCallback;
  }

  render() {
    return (
      <div className="scroll">
        <div className="scroll-holder">
          <input
            className="imageSlider"
            type="range"
            min="0"
            max={this.props.max}
            step="1"
            value={this.state.value}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }

  onChange(event) {
    this.setState({ value: event.target.value });

    this.onInputCallback(event.target.value);
  }
}

export default ImageScrollbar;
