import { Component } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import './SimpleHeaderSection.css';
import Logo from './Logo.js';
import iconUserDefault from '../images/general/icon-user-default.svg';
import InstructionsModal from './InstructionsModal';

class SimpleHeaderSection extends Component {
  constructor() {
    super();

    this.state = {
      showInstructionsModal: false
    };

    this.toggleInstructionsModal = this.toggleInstructionsModal.bind(this);
  }

  toggleInstructionsModal() {
    const currentValue = this.state.showInstructionsModal;
    this.setState({ showInstructionsModal: !currentValue });
  }

  renderInfoSection() {
    return (
      <>
        {this.state.showInstructionsModal ? (
          <InstructionsModal
            visible={this.state.showInstructionsModal}
            toggle={this.toggleInstructionsModal}
          />
        ) : ''}
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
          <button className="link helpButton" onClick={this.toggleInstructionsModal}>
            Help
          </button>
          <a
            href="https://www.crowds-cure.org/privacy"
            target="privacy"
            className="privacyButton"
          >
            Privacy
          </a>
          <button className="link logoutButton" onClick={this.logout}>
            Logout
          </button>
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
