import { Component } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import './SimpleHeaderSection.css';
import Logo from './Logo.js';
import iconUserDefault from '../images/general/icon-user-default.svg';

class SimpleHeaderSection extends Component {
  renderInfoSection() {
    return (
      <>
        <div className="userSection">
          <img
            className="userIcon noselect"
            src={iconUserDefault}
            alt={this.props.username}
          />
          <span className="username">{this.props.username}</span>
        </div>
        <div className="actionSection">
          <Link to="/leaderboard" className="leaderboardButton">
            Leaderboard
          </Link>
          <span className="logoutButton" onClick={this.logout}>
            Logout
          </span>
        </div>
      </>
    );
  }

  render() {
    const isDashboard = this.props.page === 'dashboard';
    return (
      <div className="simpleHeader">
        <Logo />
        {isDashboard && this.renderInfoSection()}
      </div>
    );
  }

  logout() {
    window.auth.logout();
  }
}

export default SimpleHeaderSection;
