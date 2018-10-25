import { Component } from 'react';
import React from 'react';

class SelectTreeBreadcrumbParent extends Component {
  render() {
    return (
      <div className="tree-breadcrumb clearfix">
        {/*-{this.props.parentNode ? (
          <SelectTreeBreadcrumbParent index={this.props.index + 1} />
        ) : (
          ""
        )*/}
        <span className="path-link">
          <div className="tree-back" data-index={this.index}>
            {this.props.parentNode ? (
              <span>{this.props.parentNode.label}</span>
            ) : (
              <i className="fa fa-fast-backward" />
            )}
          </div>
          {this.props.parentNode ? <span>/</span> : ''}
        </span>
      </div>
    );
  }
}

export default SelectTreeBreadcrumbParent;
