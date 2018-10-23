import { Component } from 'react';
import React from 'react';
import './CaseTypeCard.css';

class CaseTypeCard extends Component {
  render() {
    return (
      <div className="CaseTypeCard" onClick={this.props.click}>
        <span className="name">{this.props.name}</span>
        <div className="info-icon svgContainer">
          <svg>
            <use xlinkHref="/icons.svg#icon-trial-info" />
          </svg>
        </div>
        {/*<img src={{this.props.img}}></img>*/}
      </div>
    );
  }
}

export default CaseTypeCard;
