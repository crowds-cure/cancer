import { Component } from 'react';
import React from 'react';
import './CaseFeedback.css';
import PropTypes from 'prop-types';
import './CaseFeedback.css';

class CaseFeedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: new Set()
    };

    this.updateSelectedOptions = this.updateSelectedOptions.bind(this);
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
      <div className="CaseFeedback">
        <div className="feedback-hover">
          Case Feedback
          <span className="arrow-down" />
        </div>
        <div className="feedback-options">
          <ul>{opts}</ul>
          <button
            className="buttom"
            disabled={!this.props.skipEnabled}
            onClick={this.props.skipCase}
          >
            Skip case
          </button>
          <button className="buttom">Continue case</button>
        </div>
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
}

CaseFeedback.propTypes = {
  skipEnabled: PropTypes.bool.isRequired,
  skipCase: PropTypes.func.isRequired,
  feedbackChanged: PropTypes.func.isRequired
};

export default CaseFeedback;
