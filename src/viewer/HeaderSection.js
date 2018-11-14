import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { withRouter } from 'react-router-dom';
import Logo from '../shared/Logo.js';

import CaseProgressIndicator from './CaseProgressIndicator.js';

import './HeaderSection.css';
import '../shared/Modal.css';
import sendSessionStatisticsToDatabase from './lib/sendSessionStatisticsToDatabase';

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
    this.endSession = this.endSession.bind(this);
    this.handleClickDashboard = this.handleClickDashboard.bind(this);
  }

  toggleModal(e) {
    e.preventDefault();
    this.setState({ showInstructionsModal: !this.state.showInstructionsModal });
  }

  render() {
    return (
      <div className="HeaderSection row">
        <div className="col">
          <Logo />
        </div>

        <div className="col">
          <div className="caseProgress">
            <CaseProgressIndicator
              measurementsInCurrentSession={
                this.props.measurementsInCurrentSession
              }
            />
          </div>
          <div className="endSession">
            <button className="link" onClick={this.endSession}>
              End Session
            </button>
          </div>
          <div className="instructionsSection">
            <button className="instructions" onClick={this.toggleModal}>
              Instructions
            </button>
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
              <h2>Create</h2>
              <ul>
                <li>
                 Measure all of the metastatic lesions or lesions that may mimic metastatic disease that you can find with the bidirectional measurement tool. There is no minimum size for measurement. You will get 1 point for each lesion measurement.
                </li>
                <li>
                  Label the lesion locations and add a description (e.g.,
                  ill-defined, confluent, necrotic, etc. if applicable). Use the
                  ‘previous’ and ‘next’ buttons to review the lesions that you
                  have measured.
                </li>
                <li>
                  Use toolbar options or hotkeys (1 = soft tissue; 2 = lung; 3 =
                  liver; 4 = brain) to window/level.
                </li>
                <li>
                  Provide case feedback regarding image quality and/or presence
                  of disease. Feedback is only required if you want to skip the
                  case.
                </li>
                <li>
                  Return to the dashboard at any time to change your case type
                  selection.
                </li>
                <li>End the session (logout) when you are finished.</li>
              </ul>
              <h2>Compete</h2>
              <ul>
                <li>
                  Log back in under your username to measure more cases.
                  Measurements can be made on any personal device; you are not
                  restricted to Crowds Cure Cancer workstations.
                </li>
                <li>
                  Track your personal progress and the progress of other RSNA
                  attendees. The leaderboard will show the top individual
                  readers, residency teams, and community stats for RSNA 2018.
                </li>
              </ul>
              <h2>Contribute</h2>
              <ul>
                <li>
                  Detailed results will be posted after RSNA. Visit{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="http://www.cancerimagingarchive.net/"
                  >
                    Cancer Imaging Archive
                  </a>{' '}
                  to view{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://doi.org/10.7937/K9/TCIA.2018.OW73VLO2"
                  >
                    results from RSNA 2017
                  </a>
                  .
                </li>
                <li>
                  Interested in donating data to this project? Please{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="http://www.cancerimagingarchive.net/primary-data/"
                  >
                    visit the TCIA website
                  </a>{' '}
                  to find out how.
                </li>
              </ul>
              <span className="modal-close" onClick={this.toggleModal}>
                Close
              </span>
            </Modal>
          </div>
          <div className="dashboardSection">
            <button
              className="dashboard link"
              onClick={this.handleClickDashboard}
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  endSession() {
    const savedStartTime = this.props.sessionStart;
    const start = Math.round(savedStartTime / 1000);
    const end = Math.round(Date.now() / 1000);

    const currentSession = {
      start,
      end,
      cases: this.props.measurementsInCurrentSession
    };

    sendSessionStatisticsToDatabase(currentSession);

    this.props.history.push('/session-summary');
  }

  handleClickDashboard = () => {
    this.props.history.push('/');
  };
}

HeaderSection.propTypes = {
  sessionStart: PropTypes.number.isRequired,
  measurementsInCurrentSession: PropTypes.number.isRequired
};

export default withRouter(HeaderSection);
