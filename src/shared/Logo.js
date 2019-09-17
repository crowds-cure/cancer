import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import './Logo.css';

class Logo extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired
      }).isRequired,
      staticContext: PropTypes.object
    }).isRequired
  };

  render() {
    return (
      <div className="Logo" onClick={this.onClick}>
        <span className="logoText highlight">Crowds </span>
        <span className="logoText">Cure Cancer</span>
      </div>
    );
  }

  onClick() {
    this.context.router.history.push('/');
  }
}

export default Logo;
