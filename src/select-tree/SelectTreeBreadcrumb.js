import { Component } from 'react';
import React from 'react';
import SelectTreeBreadcrumbParent from './SelectTreeBreadcrumbParent.js';

class SelectTreeBreadcrumb extends Component {
  render() {
    return (
      <div className="tree-breadcrumb clearfix">
        <SelectTreeBreadcrumbParent />
        <span className="tree-current-node">{this.props.label}</span>
      </div>
    );
  }
}

export default SelectTreeBreadcrumb;
