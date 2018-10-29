import { Component } from 'react';
import React from 'react';
import './CaseTypeCard.css';

class CaseTypeCard extends Component {
  constructor(props) {
    super(props);

    this.redirect = this.redirect.bind(this);
  }

  render() {
    return (
      <div className="CaseTypeCard" onClick={this.props.click}>
        <div className="title">
          <span className="name">{this.props.name}</span>
          <span className="type">{this.props.type}</span>
        </div>
        <div onClick={this.redirect} className="info-icon svgContainer">
          <svg>
            <use xlinkHref="/icons.svg#icon-trial-info" />
          </svg>
        </div>
        {/*<img src={{this.props.img}}></img>*/}
      </div>
    );
  }

  redirect(event) {
    event.stopPropagation();
    window.open(this.props.link);
  }
}

export default CaseTypeCard;
