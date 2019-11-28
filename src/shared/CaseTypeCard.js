import { Component } from 'react';
import React from 'react';
import requiredIf from 'react-required-if';
import './CaseTypeCard.css';
import PropTypes from 'prop-types';
//import getAuthorizationHeader from '../openid-connect/getAuthorizationHeader.js';
//import SecuredImage from './SecuredImage.js';

const placeholderUndefined = props => props.placeholder === undefined;

class CaseTypeCard extends Component {
  static propTypes = {
    placeholder: PropTypes.number,
    click: requiredIf(PropTypes.func, placeholderUndefined),
    name: requiredIf(PropTypes.string, placeholderUndefined),
    type: requiredIf(PropTypes.string, placeholderUndefined),
    description: requiredIf(PropTypes.string, placeholderUndefined),
    img: requiredIf(PropTypes.string, placeholderUndefined),
    inCollection: requiredIf(PropTypes.number, placeholderUndefined),
    byAnnotator: requiredIf(PropTypes.number, placeholderUndefined)
  };

  render() {
    const { placeholder } = this.props;
    const completed = this.props.inCollection === this.props.byAnnotator;

    let className = 'CaseTypeCard';
    if (placeholder >= 0) {
      className += ` placeholder placeholder-${placeholder}`;
    } else if (completed) {
      className += ' complete';
    }

    let progressTitle = '';
    let currentStyle = {};
    if (placeholder === undefined) {
      const { byAnnotator, inCollection } = this.props;
      progressTitle = `${byAnnotator} / ${inCollection}`;

      const progressPercent = (byAnnotator / inCollection) * 100;
      currentStyle = {
        width: `${progressPercent}%`
      };
    }

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
            <div className="spinner">
              <svg>
                <use xlinkHref="/icons.svg#icon-spinner" />
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
            <div className="progress" data-tip={progressTitle}>
              <div className="current" style={currentStyle} />
            </div>
            <div className="typeName">{this.props.type}</div>
          </div>
        </div>
      </div>
    );
  }

  onClick = () => {
    if (this.props.inCollection === this.props.byAnnotator) {
      return;
    }

    this.props.click(this.props.name);
  };
}

export default CaseTypeCard;
