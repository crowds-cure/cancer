import { Component } from 'react';
import React from 'react';
import InputRadio from './InputRadio.js';
import SelectTreeBreadcrumb from './SelectTreeBreadcrumb.js';
import './SelectTree.css';

class SelectTree extends Component {
  render() {
    const storageKey = 'SelectTree';
    const radioClass = '';
    const getLabelClass = item => {
      return Array.isArray(item.items) ? 'tree-node' : 'tree-leaf';
    };

    let items = this.props.items;
    let sortedItems = [];
    const twoColumns = this.props.twoColumns === true;
    if (twoColumns) {
      const begin = items.splice(0, Math.ceil(items.length / 2));
      begin.forEach((item, index) => {
        sortedItems.push(item);
        if (items[index]) {
          sortedItems.push(items[index]);
        }
      });
    } else {
      sortedItems = items;
    }

    const treeItems = sortedItems.map((item, index) => {
      return (
        <InputRadio
          key={index}
          id={`${storageKey}'_'${item.value}`}
          className={radioClass}
          name={index}
          itemData={item}
          value={item.value}
          label={item.label}
          labelClass={getLabelClass(item)}
          checked={item.value}
        />
      );
    });
    const isNotRoot = this.props.root !== true;
    const searchDisabled = this.props.search === false;
    const displaySearch = isNotRoot && searchDisabled;

    const searchItem = (
      <label className="wrapperLabel tree-search">
        <input
          type="text"
          className="form-control"
          placeholder="Search labels"
        />
        <i className="fa fa-search" />
        <span className="wrapperText">Assign label</span>
      </label>
    );

    // Define inline styles to set the margin and toggle common section
    const originalWidth = '280';
    const isHidden = false;
    const marginProperty = twoColumns ? 'marginLeft' : 'marginRight';
    const marginWidth = twoColumns ? originalWidth / 2 : originalWidth + 'px';
    const treeContentStyle = {
      width: originalWidth + 'px'
    };
    treeContentStyle[marginProperty] = isHidden ? '' : marginWidth;

    const rootStyle = {
      width: originalWidth + 'px'
    };

    return (
      <div
        className="select-tree select-tree-root bounded open started"
        style={rootStyle}
      >
        <div className="tree-content" style={treeContentStyle}>
          {displaySearch ? searchItem : ''}
          <div
            className={
              this.props.currentNode ? 'tree-options collapsed' : 'tree-options'
            }
          >
            {this.props.root ? <SelectTreeBreadcrumb /> : ''}
            <div className="tree-inputs clearfix">{treeItems}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectTree;
