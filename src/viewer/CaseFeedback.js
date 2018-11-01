import { Component } from 'react';
import React from 'react';
import './CaseFeedback.css';
import PropTypes from 'prop-types';
import './CaseFeedback.css';

class CaseFeedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: new Set(),
      isOpen: false
    };

    this.updateSelectedOptions = this.updateSelectedOptions.bind(this);
    this.openDropdown = this.openDropdown.bind(this);
    this.skipCase = this.skipCase.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

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
        value: 'ContainsDualPhaseImages',
        label: 'Contains dual phase images'
      },
      {
        value: 'NoFeedback',
        label: 'No Feedback'
      }
    ];

    const opts = options.map(option => {
      const active = this.state.selected.has(option.value);
      return (
        <li key={option.value} className={active ? 'active' : ''}>
          <input
            type="checkbox"
            id={option.value}
            className="customCheckbox"
            value={option.value}
            {...(active ? 'checked' : '')}
            onChange={this.updateSelectedOptions}
          />
          <label htmlFor={option.value}>{option.label}</label>
        </li>
      );
    });

    return (
      <div className="CaseFeedback noselect">
        <div className="feedback-button" onClick={this.openDropdown}>
          Case Feedback
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
    const selected = this.state.selected;

    if (selected.has(option)) {
      selected.delete(option);
    } else {
      selected.add(option);
    }

    this.setState({ selected });

    this.props.feedbackChanged({ selected });
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
    this.setState({
      isOpen: false,
      selected: new Set()
    });

    this.props.skipCase();
  }
}

CaseFeedback.propTypes = {
  skipEnabled: PropTypes.bool.isRequired,
  skipCase: PropTypes.func.isRequired,
  feedbackChanged: PropTypes.func.isRequired
};

export default CaseFeedback;
