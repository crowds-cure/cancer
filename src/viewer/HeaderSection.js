import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

import CaseProgressIndicator from './CaseProgressIndicator.js';

import './HeaderSection.css';
import '../shared/Modal.css';

Modal.defaultStyles.overlay.backgroundColor = 'black';
Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class HeaderSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showInstructionsModal: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(e) {
    e.preventDefault();
    this.setState({ showInstructionsModal: !this.state.showInstructionsModal });
  }

  render() {
    return (
      <div className="HeaderSection row">
        <div className="col">
          <div className="logo">
            <span className="logoText highlight">Crowds </span>
            <span className="logoText">Cure Cancer</span>
          </div>
        </div>
        <div className="col">
          <div className="caseProgress">
            <CaseProgressIndicator
              casesInCurrentSession={this.props.casesInCurrentSession}
            />
          </div>
          <div className="endSession">
            <Link to="/session-summary" className="link">
              End Session
            </Link>
          </div>
          <div className="instructionsSection">
            <a href="#" className="instructions" onClick={this.toggleModal}>
              Instructions
            </a>
            <Modal
              isOpen={this.state.showInstructionsModal}
              contentLabel="Instructions"
              onRequestClose={this.toggleModal}
              styles={customStyles}
              className="Modal"
              overlayClassName="Overlay"
              closeTimeoutMS={200}
            >
              <h1>Instructions</h1>
              <p>Measure all lesions you can find.</p>
              <span className="modal-close" onClick={this.toggleModal}>
                Close
              </span>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

HeaderSection.propTypes = {
  casesInCurrentSession: PropTypes.number.isRequired
};

export default HeaderSection;
