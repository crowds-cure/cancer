import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import './CaseProgress.css';

import sendSessionStatisticsToDatabase from './lib/sendSessionStatisticsToDatabase';
import saveAchievementsToDatabase from './lib/saveAchievementsToDatabase';
import animateNumber from '../shared/animateNumber';
import waitForAnimation from '../shared/waitForAnimation';
import InstructionsModal from '../shared/InstructionsModal';

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

  render() {
    return (
      <div className="d-flex no-gutters CaseProgress">
        {this.state.showInstructionsModal ? (
          <InstructionsModal
            visible={this.state.showInstructionsModal}
            toggle={this.toggleInstructionsModal}
          />
        ) : ''}
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
