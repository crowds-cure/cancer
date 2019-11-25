import { Component } from 'react';
import React from 'react';
import Modal from 'react-modal';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import './CaseProgress.css';

import sendSessionStatisticsToDatabase from './lib/sendSessionStatisticsToDatabase';
import saveAchievementsToDatabase from './lib/saveAchievementsToDatabase';
import animateNumber from '../shared/animateNumber';
import waitForAnimation from '../shared/waitForAnimation';

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

class CaseProgress extends Component {
  constructor(props) {
    super(props);

    this.preventAnimations = false;
    this.animationsPromise = Promise.resolve();

    this.state = {
      sessionMeasurements: this.props.sessionMeasurements || 0,
      caseMeasurements: this.props.caseMeasurements || 0,
      incrementText: this.props.caseMeasurements || 0,
      showInstructionsModal: false
    };

    this.sessionRef = React.createRef();
    this.incrementRef = React.createRef();

    this.caseSelect = this.caseSelect.bind(this);
    this.endSession = this.endSession.bind(this);
    this.toggleInstructionsModal = this.toggleInstructionsModal.bind(this);
    this.renderInstructionsModal = this.renderInstructionsModal.bind(this);
  }

  caseSelect = () => {
    this.props.history.push('/');
  };

  endSession() {
    const savedStartTime = this.props.sessionStart;
    const start = Math.round(savedStartTime / 1000);
    const end = Math.round(Date.now() / 1000);
    const { totalCompleteCollection } = this.props;
    const currentSession = {
      start,
      end,
      cases: this.props.measurementsInCurrentSession
    };

    sendSessionStatisticsToDatabase(currentSession).then(() => {
      // Determine and save the earned achievements
      // after session statistics are saved to db
      saveAchievementsToDatabase(totalCompleteCollection);
    });

    this.props.history.push('/session-summary');
  }

  toggleInstructionsModal() {
    const currentValue = this.state.showInstructionsModal;
    this.setState({ showInstructionsModal: !currentValue });
  }

  componentWillUnmount() {
    this.preventAnimations = true;
  }

  componentDidUpdate() {
    const sessionElement = this.sessionRef.current;

    if (this.state.sessionMeasurements !== this.props.sessionMeasurements) {
      this.setState({ sessionMeasurements: this.props.sessionMeasurements });
      const valueFrom = this.state.sessionMeasurements;
      const valueTo = this.props.sessionMeasurements;
      animateNumber(sessionElement, valueTo, valueFrom);
    }

    const oldIncrementValue = this.state.caseMeasurements;
    const newIncrementValue = this.props.caseMeasurements;
    if (newIncrementValue !== oldIncrementValue) {
      this.animateIncrement(oldIncrementValue, newIncrementValue);
    }
  }

  async animateIncrement(oldValue, newValue) {
    await this.animationsPromise;
    if (this.preventAnimations) {
      return;
    }

    this.setState({ caseMeasurements: newValue });

    const element = this.incrementRef.current;
    if (!element) {
      return;
    } else if (newValue === 0) {
      this.animationsPromise = waitForAnimation(element, 'slideOut');
    } else if (newValue === 1 && newValue > oldValue) {
      this.setState({ incrementText: newValue });
      this.animationsPromise = waitForAnimation(element, 'slideIn');
    } else {
      this.animationsPromise = waitForAnimation(element, 'shift');
      await this.animationsPromise;
      const { caseMeasurements } = this.props;
      if (!this.preventAnimations && caseMeasurements === newValue) {
        this.setState({ incrementText: newValue });
      }
    }
  }

  getIncrementClass(caseMeasurements) {
    let className = `increment`;
    if (caseMeasurements) {
      className += ' visible';
    } else {
      className += ' hidden';
    }

    return className;
  }

  renderInstructionsModal() {
    return (
      <Modal
        isOpen={this.state.showInstructionsModal}
        contentLabel="Instructions"
        onRequestClose={this.toggleInstructionsModal}
        styles={customStyles}
        className="Modal"
        overlayClassName="Overlay"
        closeTimeoutMS={200}
      >
        <h1>Instructions</h1>
        <h2>Create</h2>
        <ul>
          <li>
            <p>
              Measure all of the metastatic lesions or lesions that may mimic
              metastatic disease that you find. There is no minimum size for
              lesion measurement. You will get 1 point for each measurement.
            </p>
          </li>
          <li>
            <p>
              Label the lesion (e.g. liver, lung, etc.) to add value. Use the
              ‘previous’ and ‘next’ lesion buttons to review your measurements.
            </p>
          </li>
          <li>
            <p>
              Provide case feedback regarding image quality and/or presence of
              disease. Feedback is only required if you want to skip the case.
            </p>
          </li>
          <li>
            <p>
              Return to the dashboard at any time to view another imaging
              collection. End the session (logout) when you are finished.
            </p>
          </li>
        </ul>
        <h2>Compete</h2>
        <ul>
          <li>
            <p>
              Log back in with your email or anonymous username to measure more
              cases. Measurements can be made on any personal device; you are
              not restricted to Crowds Cure Cancer workstations.
            </p>
          </li>
          <li>
            <p>
              Track your personal progress and the progress of other RSNA
              attendees. The leaderboard will show the top individual readers,
              and teams for RSNA 2019.
            </p>
          </li>
        </ul>
        <h2>Contribute</h2>
        <ul>
          <li>
            <p>
              Detailed results will be posted after RSNA. Visit{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.cancerimagingarchive.net/"
              >
                The Cancer Imaging Archive
              </a>{' '}
              to view results from{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://doi.org/10.7937/K9/TCIA.2018.OW73VLO2"
              >
                RSNA 2017
              </a>{' '}
              and{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://doi.org/10.7937/TCIA.2019.yk0gm1eb"
              >
                RSNA 2018
              </a>
              .
            </p>
          </li>
          <li>
            <p>
              Interested in donating data to this project? Please visit the{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.cancerimagingarchive.net/primary-data/"
              >
                TCIA website
              </a>{' '}
              to find out how.
            </p>
          </li>
        </ul>
        <span className="modal-close" onClick={this.toggleInstructionsModal}>
          Close
        </span>
      </Modal>
    );
  }

  render() {
    return (
      <div className="d-flex no-gutters CaseProgress">
        {this.renderInstructionsModal()}
        <div className="sessionCount">
          <div className="value" ref={this.sessionRef}>
            0
          </div>
          <div
            className={this.getIncrementClass(this.state.caseMeasurements)}
            ref={this.incrementRef}
          >
            +{this.state.incrementText}
          </div>
        </div>
        <div className="icon caseSelect" onClick={this.caseSelect}>
          <svg>
            <use xlinkHref="/icons.svg#icon-case-select" />
          </svg>
          <div>
            Case
            <br className="d-xs-none" /> select
          </div>
        </div>
        <div className="icon endSession" onClick={this.endSession}>
          <svg>
            <use xlinkHref="/icons.svg#icon-end-session" />
          </svg>
          <div>
            End
            <br className="d-xs-none" /> session
          </div>
        </div>
        <div
          className="icon instructions"
          onClick={this.toggleInstructionsModal}
        >
          <svg>
            <use xlinkHref="/icons.svg#icon-help" />
          </svg>
          <div>Help</div>
        </div>
      </div>
    );
  }
}

CaseProgress.propTypes = {
  sessionMeasurements: PropTypes.number.isRequired,
  caseMeasurements: PropTypes.number.isRequired
};

export default withRouter(CaseProgress);
