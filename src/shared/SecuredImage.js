import { Component } from 'react';
import React from 'react';
import './Checkbox.css';
import PropTypes from 'prop-types';

async function fetchImage(url, headers) {
  return fetch(url, headers)
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob));
}

class SecuredImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      objectUrl: null
    };

    fetchImage(this.props.src, {
      method: 'GET',
      headers: this.props.getAuthorizationHeader()
    })
      .then(objectUrl => {
        this.setState({
          objectUrl
        });
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <img
        src={this.state.objectUrl}
        alt={this.props.name}
        className="screenshot"
        ref={img => (this.img = img)}
        onError={() => (this.img.style.display = 'none')}
      />
    );
  }
}

SecuredImage.propTypes = {
  id: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
  getAuthorizationHeader: PropTypes.func.isRequired
};

export default SecuredImage;
