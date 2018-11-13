import { Component } from 'react';
import React from 'react';

class SelectTreeBreadcrumb extends Component {
  render() {
    const radioLabelId = 'selectTreeBreadcrumb';
    return (
      <div className="row breadcrumb">
        <label
          className={'wrapperLabel radioLabel col-16'}
          htmlFor={radioLabelId}
        >
          <input
            type="radio"
            id={radioLabelId}
            className={'tree-node radioInput'}
            value={this.props.value}
            onChange={this.props.onSelected}
          />
          <span className="wrapperText">
            <span className="backIcon">
              <svg>
                <use xlinkHref="/icons.svg#fast-backward" />
              </svg>
            </span>
            {this.props.label}
          </span>
        </label>
      </div>
    );
  }
}

export default SelectTreeBreadcrumb;
