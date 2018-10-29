import { Component } from 'react';
import React from 'react';
import './CaseTypeCard.css';
import PropTypes from 'prop-types';

class CaseTypeCard extends Component {
  constructor(props) {
    super(props);

    this.redirect = this.redirect.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  render() {
    return (
      <div className="CaseTypeCard" onClick={this.onClick}>
        <div className="title">
          <span className="name">{this.props.name}</span>
          <span className="type">{this.props.type}</span>
        </div>
        <div
          onClick={this.redirect}
          title={this.props.description}
          className="info-icon svgContainer"
        >
          <svg>
            <use xlinkHref="/icons.svg#icon-trial-info" />
          </svg>
        </div>
        {/*<img src={{this.props.img}}></img>*/}
      </div>
    );
  }

  onClick() {
    this.props.click(this.props.name);
  }

  redirect(event) {
    event.stopPropagation();
    window.open(this.props.link);
  }
}

CaseTypeCard.propTypes = {
  click: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default CaseTypeCard;
