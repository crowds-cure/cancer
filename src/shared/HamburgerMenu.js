import { Component } from 'react';
import React from 'react';
import './HamburgerMenu.css';
import PropTypes from 'prop-types';

class HamburgerMenu extends Component {
  constructor(props) {
    super(props);

    this.menuOptions = React.createRef();
    this.menuBackground = React.createRef();
    this.menuButton = React.createRef();
    this.menuOpened = false;
  }

  render() {
    return (
      <>
        <button
          ref={this.menuButton}
          className="HamburgerMenu btn noselect menuHide"
          onClick={this.toggleMenu.bind(this)}
        >
          <svg className="icon-bars">
            <use xlinkHref="/icons.svg#bars" />
          </svg>
          <svg className="icon-close">
            <use xlinkHref="/icons.svg#close-solid" />
          </svg>
        </button>
        <div
          className="hamburgerMenuBackground d-none"
          ref={this.menuBackground}
          onMouseDown={this.toggleMenu}
          onTouchStart={this.toggleMenu}
        />
        <div ref={this.menuOptions} className="HamburgerOptions">
          {this.props.options}
        </div>
      </>
    );
  }

  toggleMenu = () => {
    debugger;
    this.menuOpened = !this.menuOpened;
    this.menuBackground.current.classList.toggle('d-none');
    this.menuOptions.current.classList.toggle('open');
    this.menuButton.current.classList.toggle('menuHide');
  };
}

HamburgerMenu.propTypes = {
  options: PropTypes.object.isRequired
};

export default HamburgerMenu;
