import { Component } from 'react';
import React from 'react';
import InputRadio from './InputRadio.js';
import SelectTreeBreadcrumb from './SelectTreeBreadcrumb.js';
import './SelectTree.css';
import styleProperty from './styleProperty.js';

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
      value: props.value
    };

    this.onClickNode = this.onClickNode.bind(this);
    this.isNodeActive = this.isNodeActive.bind(this);
    this.getLabelClass = this.getLabelClass.bind(this);
    this.getTreeItems = this.getTreeItems.bind(this);

    this.rootNode = React.createRef();
  }

  getLabelClass(item) {
    return Array.isArray(item.items) ? 'tree-node' : 'tree-leaf';
  }

  isNodeActive(item) {
    return this.state.value === item;
  }

  getTreeItems() {
    const storageKey = 'SelectTree';
    const radioClass = '';

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
          labelClass={this.getLabelClass(item)}
          active={this.isNodeActive(item)}
          checked={item.value}
          click={event => this.onClickNode(event, item)}
        />
      );
    });

    return treeItems;
  }

  render() {
    const isNotRoot = this.props.root !== true;
    const searchDisabled = this.props.searchEnabled === false;
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
    const twoColumns = this.props.twoColumns === true;
    const marginProperty = twoColumns ? 'marginLeft' : 'marginRight';
    const marginWidth = twoColumns ? originalWidth / 2 : originalWidth + 'px';
    const treeContentStyle = {
      width: originalWidth + 'px'
    };
    treeContentStyle[marginProperty] = isHidden ? '' : marginWidth + 'px';

    const rootStyle = {
      width: originalWidth + 'px'
    };

    const selectedClass = this.props.value ? 'selected navigated' : '';
    const treeItems = this.getTreeItems();

    return (
      <div
        ref={this.rootNode}
        className={`select-tree select-tree-root bounded open started ${selectedClass}`}
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

  onClickNode(event, item) {
    console.log(event);
    console.log(event.target);
    console.log(event.currentTarget);
    const nodeType = this.getLabelClass(item);

    // Check if the clicked element is a node or a leaf
    if (nodeType === 'tree-leaf') {
      // Set the selected leaf value in the root component
      // Mark the component as selected
      this.setState({
        value: item
      });

      console.log(`Set State: value : ${item.value}`);
    } else {
      const getPosition = element => {
        if (this.props.useTransform) {
          const matrixToArray = str => str.match(/(-?[0-9.]+)/g);
          const transformMatrix = matrixToArray(element.style.transform) || [];
          return {
            x: parseFloat(transformMatrix[4]) || 0,
            y: parseFloat(transformMatrix[5]) || 0
          };
        } else {
          return {
            x: parseFloat(element.style.left),
            y: parseFloat(element.style.top)
          };
        }
      };

      // Get the position of the clicked element
      const element = event.target;
      const label = element.querySelector('label');
      const position = element.getBoundingClientRect();

      const setPosition = (element, position) => {
        if (this.props.useTransform) {
          const translation = `translate(${position.x}px, ${position.y}px)`;
          styleProperty.set(element, 'transform', translation);
        } else {
          element.style.left = `${position.x}px`;
          element.style.top = `${position.y}px`;
        }
      };

      // Do the transition from the clicked position to top
      setPosition(this.rootNode, position);
      /*setTimeout(() => $treeNode.css("top", 0));

      const optionsTop = $target.closest(".tree-options").position().top;
      //const treeOffsetTop = this.rootNode.offset().top;
      const treeRootPosition = getPosition(this.rootNode);
      treeRootPosition.y += offsetTop - treeOffsetTop - optionsTop;
      setPosition(this.rootNode, treeRootPosition);*/
    }
  }
}

export default SelectTree;
