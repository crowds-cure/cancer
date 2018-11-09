import { Component } from 'react';
import React from 'react';
import './CaseTypeCard.css';
import PropTypes from 'prop-types';
//import getAuthorizationHeader from '../openid-connect/getAuthorizationHeader.js';
//import SecuredImage from './SecuredImage.js';

class CaseTypeCard extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  render() {
    const completed = this.props.inCollection === this.props.byAnnotator;

    let className = 'CaseTypeCard';
    if (completed) {
      className += ' complete';
    }

    return (
      <div className="col-16 col-md-8 col-lg-5">
        <div className={className} onClick={this.onClick}>
          {completed && (
            <span className="complete-flag">
              <svg>
                <use xlinkHref="/icons.svg#icon-check-circle" />
              </svg>
            </span>
          )}
          <div className="imgContainer">
            <div
              onClick={this.props.clickInfo}
              title={this.props.description}
              className="info-icon svgContainer"
            >
              <svg>
                <use xlinkHref="/icons.svg#icon-trial-info" />
              </svg>
            </div>
            <img
              alt={this.props.name}
              className="screenshot"
              ref={img => (this.img = img)}
              src={this.props.img}
              onError={() => (this.img.style.display = 'none')}
            />
            {/*

            Removing this for now because CouchDB serving attachments
            is horribly slow

            <SecuredImage
              alt={this.props.name}
              className="screenshot"
              ref={img => (this.img = img)}
              src={this.props.img}
              onError={() => (this.img.style.display = 'none')}
              getAuthorizationHeader={getAuthorizationHeader}
            />*/}
          </div>
          <div className="title">
            <span className="name">{this.props.name}</span>
            <span className="type">
              {this.props.type} - {this.props.byAnnotator}/
              {this.props.inCollection}
            </span>
          </div>
        </div>
      </div>
    );
  }

  onClick() {
    if (this.props.inCollection === this.props.byAnnotator) {
      return;
    }

    this.props.click(this.props.name);
  }
}

CaseTypeCard.propTypes = {
  click: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  inCollection: PropTypes.number.isRequired,
  byAnnotator: PropTypes.number.isRequired
};

export default CaseTypeCard;
