import { Component } from 'react';
import React from 'react';
import './HamburgerMenu.css';
import PropTypes from 'prop-types';

class HamburgerMenu extends Component {
  render() {
    return (
      <>
        <button className="HamburgerMenu btn noselect">
          <svg>
            <use xlinkHref="/icons.svg#bars" />
          </svg>
        </button>
        <div className="d-none">{this.props.options}</div>
      </>
    );
  }
}

HamburgerMenu.propTypes = {
  options: PropTypes.object.isRequired
};

export default HamburgerMenu;
