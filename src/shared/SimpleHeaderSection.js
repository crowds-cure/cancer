import { Component } from 'react';
import React from 'react';
import './SimpleHeaderSection.css';
import Logo from './Logo.js';

class SimpleHeaderSection extends Component {
  render() {
    const isDashboard = this.props.page === 'dashboard';
    const logoutButtons = (
      <div className="logoutSection">
        <span className="username">{this.props.username}</span>
        <span className="logoutButton" onClick={this.logout}>
          Logout
        </span>
      </div>
    );
    return (
      <div className="simpleHeader">
        <Logo />
        {isDashboard && logoutButtons}
      </div>
    );
  }

  logout() {
    window.auth.logout();
  }
}

export default SimpleHeaderSection;
