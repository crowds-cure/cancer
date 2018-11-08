import { Component } from 'react';
import React from 'react';

import InputRadio from './InputRadio.js';
import SelectTreeBreadcrumb from './SelectTreeBreadcrumb.js';

import cloneDeep from 'lodash.clonedeep';

import './SelectTree.css';

const columnsClassMap = ['', 'col-16', 'col-8', 'col-5', 'col-4', 'col-3'];

class SelectTree extends Component {
  static defaultProps = {
    columns: 2,
    searchEnabled: false,
    items: []
  };

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: null,
      currentNode: null,
      value: null
    };
  }

  render() {
    const treeItems = this.getTreeItems();

    return (
      <div className="select-tree select-tree-root">
        <div className="tree-content container">
          {this.headerItem}
          <div className="tree-options">
            {this.state.currentNode && (
              <SelectTreeBreadcrumb
                onSelected={this.onBreadcrumbSelected}
                label={this.state.currentNode.label}
                value={this.state.currentNode.value}
              />
            )}
            <div className="tree-inputs row">{treeItems}</div>
          </div>
        </div>
      </div>
    );
  }

  isLeafSelected = item => item && !Array.isArray(item.items);

  getLabelClass = item => {
    return Array.isArray(item.items) ? 'tree-node' : 'tree-leaf';
  };

  getTreeItems() {
    const storageKey = 'SelectTree';
    const columnsClass = columnsClassMap[this.props.columns];
    let treeItems;

    if (this.state.currentNode) {
      treeItems = cloneDeep(this.state.currentNode.items);
    } else {
      treeItems = cloneDeep(this.props.items);
    }

    return treeItems.map((item, index) => {
      let itemKey = index;
      if (this.state.currentNode) {
        itemKey += `_${this.state.currentNode.value}`;
      }
      return (
        <InputRadio
          key={itemKey}
          id={`${storageKey}_${item.value}`}
          name={index}
          itemData={item}
          value={item.value}
          label={item.label}
          labelClass={`${this.getLabelClass(item)} ${columnsClass}`}
          onSelected={this.onSelected}
        />
      );
    });
  }

  headerItem = (
    <div className="wrapperLabel tree-header row">
      {this.props.searchEnabled === true && (
        <>
          <input
            type="text"
            className="form-control"
            placeholder="Search labels"
          />
          <i className="fa fa-search" />
        </>
      )}
      <div className="wrapperText">{this.props.selectTreeTitle}</div>
    </div>
  );

  onSelected = (event, item) => {
    if (this.isLeafSelected(item)) {
      this.setState({
        value: item
      });

      if (this.state.currentNode) {
        return this.props.onSelected(event, this.state.currentNode, item);
      } else {
        return this.props.onSelected(event, item, null);
      }
    } else {
      this.setState({
        currentNode: item
      });
    }
  };

  onBreadcrumbSelected = () => {
    this.setState({
      currentNode: null
    });
  };
}

export default SelectTree;
