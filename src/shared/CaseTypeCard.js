import { Component } from 'react';
import React from 'react';
import './CaseTypeCard.css';
import PropTypes from 'prop-types';

class CaseTypeCard extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  render() {
    return (
      <div className="col-16 col-md-8 col-lg-5">
        <div className="CaseTypeCard" onClick={this.onClick}>
          <div className="title">
            <span className="name">{this.props.name}</span>
            <span className="type">{this.props.type}</span>
          </div>
          <div
            onClick={this.props.clickInfo}
            title={this.props.description}
            className="info-icon svgContainer"
          >
            <svg>
              <use xlinkHref="/icons.svg#icon-trial-info" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  onClick() {
    this.props.click(this.props.name);
  }
}

CaseTypeCard.propTypes = {
  click: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default CaseTypeCard;
