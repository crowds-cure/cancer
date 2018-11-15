import { Component } from 'react';
import React from 'react';
import './CaseFeedback.css';
import PropTypes from 'prop-types';
import './CaseFeedback.css';
import Checkbox from '../shared/Checkbox.js';

class CaseFeedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.updateSelectedOptions = this.updateSelectedOptions.bind(this);
    this.openDropdown = this.openDropdown.bind(this);
    this.skipCase = this.skipCase.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  static defaultProps = {
    label: 'Case Feedback'
  };

  render() {
    const options = [
      {
        value: 'InadequateIVContrast',
        label: 'Inadequate IV contrast'
      },
      {
        value: 'NoIVContrast',
        label: 'No IV contrast'
      },
      {
        value: 'MotionArtifact',
        label: 'Motion artifact'
      },
      {
        value: 'MissingAnatomy',
        label: 'Missing anatomy'
      },
      {
        value: 'PoorImageQualityOther',
        label: 'Poor image quality, other'
      },
      {
        value: 'NoDiseaseIdentified',
        label: 'No disease identified'
      },
      {
        value: 'NoMeasurableDisease',
        label: 'No measurable disease'
      },
      {
        value: 'ContainsMultiPhaseImages',
        label: 'Contains multi-phase images'
      },
      {
        value: 'NoFeedback',
        label: 'No Feedback'
      },
      {
        value: 'LikelyBenign',
        label: 'Likely benign'
      }
    ];

    const opts = options.map(option => {
      const active = this.props.feedbackSelected.includes(option.value);
      return (
        <li key={option.value} className={active ? 'active' : ''}>
          <Checkbox
            id={option.value}
            label={option.label}
            value={option.value}
            checked={active ? true : false}
            onChange={this.updateSelectedOptions}
          />
        </li>
      );
    });

    return (
      <div className="CaseFeedback noselect">
        <div
          className="feedback-button"
          active={this.state.isOpen ? 'true' : 'false'}
          onClick={this.openDropdown}
        >
          {this.props.label}
          <span className="arrow-down" />
        </div>
        {this.state.isOpen && (
          <div className="feedback-options">
            <ul>{opts}</ul>
            <button
              className="buttom"
              disabled={!this.props.skipEnabled}
              onClick={this.skipCase}
            >
              Skip case
            </button>
            <button className="buttom" onClick={this.closeDropdown}>
              Continue case
            </button>
          </div>
        )}
      </div>
    );
  }

  updateSelectedOptions(event) {
    const option = event.target.id;
    const selected = new Set(this.props.feedbackSelected);

    if (selected.has(option)) {
      selected.delete(option);
    } else {
      selected.add(option);
    }

    this.props.feedbackChanged(Array.from(selected));
  }

  openDropdown() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  closeDropdown() {
    this.setState({
      isOpen: false
    });
  }

  skipCase() {
    this.closeDropdown();
    this.props.skipCase();
  }
}

CaseFeedback.propTypes = {
  label: PropTypes.string.isRequired,
  skipEnabled: PropTypes.bool.isRequired,
  skipCase: PropTypes.func.isRequired,
  feedbackChanged: PropTypes.func.isRequired,
  feedbackSelected: PropTypes.array.isRequired
};

export default CaseFeedback;
