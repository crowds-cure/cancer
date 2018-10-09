import { Component } from 'react';
import React from 'react';
import './ImageScrollbar.css';

class ImageScrollbar extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      value: props.value
    };

    this.onInputCallback = this.props.onInputCallback;
  }

  static getDerivedStateFromProps(props, state) {
    // Here we override any internal state that is present
    // when the higher-level CornerstoneViewport component
    // has updated the value property.
    if (props.value !== state.value) {
      return {
        value: props.value
      };
    }

    // Return null if the state hasn't changed
    return null;
  }

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
