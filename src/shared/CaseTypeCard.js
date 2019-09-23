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

    const progressTitle = `${this.props.byAnnotator} / ${
      this.props.inCollection
    }`;

    return (
      <div className="col-16 col-xs-8 col-sm-third col-md-4 col-lg-third">
        <div className={className} onClick={this.onClick}>
          <div className="imageContainer">
            <div
              onClick={this.props.clickInfo}
              title={this.props.description}
              className="infoIcon svgContainer"
            >
              <svg>
                <use xlinkHref="/icons.svg#icon-trial-info" />
              </svg>
            </div>
            <img
              alt={this.props.name}
              className="screenshot noselect"
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
          <div className="infoContainer">
            <div className="progress" title={progressTitle}>
              <div className="current" />
            </div>
            <div className="typeName">{this.props.type}</div>
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
