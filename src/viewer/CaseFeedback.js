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
        value: 'poorQuality',
        label: 'Poor Image Quality'
      },
      {
        value: 'noDisease',
        label: 'No disease'
      },
      {
        value: 'nonContrast',
        label: 'Non-contrast'
      },
      {
        value: 'artifact',
        label: 'Artifact'
      },
      {
        value: 'unspecified',
        label: 'No Feedback'
      }
    ];

    const opts = options.map(option => {
      const active = this.state.selected.has(option.value);
      return (
        // TODO: Replace (CHECKED) with a checkmark or something
        <li key={option.value} className={active ? 'active' : ''}>
          <button id={option.value} onClick={this.updateSelectedOptions}>
            {active ? '(CHECKED) ' : ''}
            {option.label}
          </button>
        </li>
      );
    });

    return (
      <div className="CaseFeedback">
        <span className="feedback-hover">Case Feedback</span>
        <ul className="feedback-options">{opts}</ul>
      </div>
    );
  }

  updateSelectedOptions(event) {
    const option = event.target.id;
    console.warn(`clicked: ${option}`);

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
  feedbackChanged: PropTypes.func.isRequired
};

export default CaseFeedback;
