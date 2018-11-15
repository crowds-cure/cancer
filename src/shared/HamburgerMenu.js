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
        <div class="d-none">{this.props.options}</div>
      </>
    );
  }
}

HamburgerMenu.propTypes = {
  options: PropTypes.string.isRequired
};

export default HamburgerMenu;
