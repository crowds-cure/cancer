import { Component } from 'react';
import React from 'react';

import InputRadio from './InputRadio.js';
import SelectTreeBreadcrumb from './SelectTreeBreadcrumb.js';
import styleProperty from './styleProperty.js';

import './SelectTree.css';

// Use hardware acceleration to move element
// if browser supports translate property
const useTransform = styleProperty.check('transform', 'translate(1px, 1px)');

class SelectTree extends Component {
  static defaultProps = {
    useTransform,
    value: null,
    twoColumns: true,
    isRoot: true,
    searchEnabled: true,
    items: []
  };

  constructor(props) {
    super(props);

    this.state = {
      itemSelected: props.value
    };

    this.rootNode = React.createRef();
  }

  getLabelClass(item) {
    return Array.isArray(item.items) ? 'tree-node' : 'tree-leaf';
  }

  isNodeActive(item) {
    return this.state.itemSelected === item;
  }

  isLeafSelected() {
    return (
      this.state.itemSelected !== null && this.state.itemSelected !== undefined
    );
  }

  getTreeItems() {
    const storageKey = 'SelectTree';
    const items = this.props.items;
    let sortedItems = items;
    let columnsClass = 'col-16';
    if (this.props.twoColumns) {
      columnsClass = 'col-8';
    }

    if (this.isLeafSelected()) {
      sortedItems = [this.state.itemSelected];
    }
    debugger;
    const treeItems = sortedItems.map((item, index) => {
      return (
        <InputRadio
          key={index}
          id={`${storageKey}_${item.value}`}
          name={index}
          itemData={item}
          value={item.value}
          label={item.label}
          labelClass={`${this.getLabelClass(item)}  ${columnsClass}`}
          active={this.isNodeActive(item)}
          onSelected={this.onSelected}
        />
      );
    });

    return treeItems;
  }

  render() {
    const isNotRoot = this.props.root !== true;
    const searchDisabled = this.props.searchEnabled === false;
    const displaySearch = isNotRoot && searchDisabled;
    const selectedClass = this.state.itemSelected ? 'selected navigated' : '';
    const treeItems = this.getTreeItems();

    return (
      <div
        ref={this.rootNode}
        className={`select-tree select-tree-root bounded open started ${selectedClass}`}
      >
        <div className="tree-content container">
          {displaySearch ? this.searchItem() : ''}
          <div
            className={
              'tree-options' + (this.props.currentNode ? ' collapsed' : '')
            }
          >
            {this.props.root ? <SelectTreeBreadcrumb /> : ''}
            <div className="tree-inputs row">{treeItems}</div>
          </div>
        </div>
      </div>
    );
  }

  searchItem() {
    return (
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
  }

  onSelected = (event, item) => {
    const nodeType = this.getLabelClass(item);

    // Check if the clicked element is a node or a leaf
    if (nodeType === 'tree-leaf') {
      // Set the selected leaf value in the root component
      // Mark the component as selected

      this.setState({
        itemSelected: item
      });

      this.props.onSelect(event, item);
    } else {
      // const getPosition = element => {
      //   if (this.props.useTransform) {
      //     const matrixToArray = str => str.match(/(-?[0-9.]+)/g);
      //     const transformMatrix = matrixToArray(element.style.transform) || [];
      //     return {
      //       x: parseFloat(transformMatrix[4]) || 0,
      //       y: parseFloat(transformMatrix[5]) || 0
      //     };
      //   } else {
      //     return {
      //       x: parseFloat(element.style.left),
      //       y: parseFloat(element.style.top)
      //     };
      //   }
      // };
      // // Get the position of the clicked element
      // const element = event.target;
      // const label = element.querySelector('label');
      // const position = element.getBoundingClientRect();
      // const setPosition = (element, position) => {
      //   if (this.props.useTransform) {
      //     const translation = `translate(${position.x}px, ${position.y}px)`;
      //     styleProperty.set(element, 'transform', translation);
      //   } else {
      //     element.style.left = `${position.x}px`;
      //     element.style.top = `${position.y}px`;
      //   }
      // };
      // // Do the transition from the clicked position to top
      // setPosition(this.rootNode, position);
      // /*setTimeout(() => $treeNode.css("top", 0));
      // const optionsTop = $target.closest(".tree-options").position().top;
      // //const treeOffsetTop = this.rootNode.offset().top;
      // const treeRootPosition = getPosition(this.rootNode);
      // treeRootPosition.y += offsetTop - treeOffsetTop - optionsTop;
      // setPosition(this.rootNode, treeRootPosition);*/
    }
  };
}

export default SelectTree;
