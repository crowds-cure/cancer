import { Component } from 'react';
import React from 'react';
import './SimpleHeaderSection.css';

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
        <div className="logo">
          <span className="logoText highlight">Crowds </span>
          <span className="logoText">Cure Cancer</span>
        </div>
        {isDashboard && logoutButtons}
      </div>
    );
  }

  logout() {
    window.auth.logout();
  }
}

export default SimpleHeaderSection;
