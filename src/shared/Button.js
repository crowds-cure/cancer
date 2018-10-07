import { Link } from 'react-router-dom';

import { Component } from 'react';
import React from 'react';

const style = {
  textAlign: 'center',
  color: 'white',
  background: 'red',
  overflow: 'hidden'
};

class Button extends Component {
  render() {
    const text = this.props.text || 'Dashboard';
    const location = this.props.location || '/dashboard';
    // TODO: Probably a better way to make this

    return (
      <Link style={style} to={location}>
        {text}
      </Link>
    );
  }
}

export default Button;
