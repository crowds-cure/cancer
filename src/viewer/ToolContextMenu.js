import { Component } from 'react';
import React from 'react';
import './ViewportOverlay.css';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import PropTypes from 'prop-types';
import './ToolContextMenu.css';

const toolTypes = ['Bidirectional'];

let defaultDropdownItems = [
  {
    actionType: 'Delete',
    action: ({ nearbyToolData, eventData }) => {
      const element = eventData.element;

      cornerstoneTools.removeToolState(
        element,
        nearbyToolData.toolType,
        nearbyToolData.tool
      );
      cornerstone.updateImage(element);
    }
  }
];

function getNearbyToolData(element, coords, toolTypes) {
  const nearbyTool = {};
  let pointNearTool = false;

  toolTypes.forEach(toolType => {
    const toolData = cornerstoneTools.getToolState(element, toolType);
    if (!toolData) {
      return;
    }

    toolData.data.forEach(function(data, index) {
      const toolInterface = cornerstoneTools[`${toolType}Tool`];

      // TODO: vNext wants me to do this?
      // Switch to cornerstoneTools.store.state.tools
      const t = new toolInterface();

      if (t.pointNearTool(element, data, coords)) {
        pointNearTool = true;
        nearbyTool.tool = data;
        nearbyTool.index = index;
        nearbyTool.toolType = toolType;
      }
    });

    if (pointNearTool) {
      return false;
    }
  });

  return pointNearTool ? nearbyTool : undefined;
}

function getTypeText(toolData, actionType) {
  const message = `${toolData.toolType}`;

  return `${actionType} ${message}`;
}

function getDropdownItems(eventData, isTouchEvent = false) {
  const nearbyToolData = getNearbyToolData(
    eventData.element,
    eventData.currentPoints.canvas,
    toolTypes
  );

  // Annotate tools for touch events already have a press handle to edit it, has a better UX for deleting it
  if (isTouchEvent && nearbyToolData.toolType === 'arrowAnnotate') return;

  let dropdownItems = [];
  if (nearbyToolData) {
    defaultDropdownItems.forEach(function(item) {
      item.params = {
        eventData,
        nearbyToolData
      };
      item.text = getTypeText(nearbyToolData, item.actionType);

      dropdownItems.push(item);
    });
  }

  return dropdownItems;
}

class ToolContextMenu extends Component {
  render() {
    if (!this.props.toolContextMenuData) {
      return '';
    }

    const { eventData, isTouchEvent } = this.props.toolContextMenuData;
    const dropdownItems = getDropdownItems(eventData, isTouchEvent);
    const dropdownComponents = dropdownItems.map(item => {
      const itemOnClick = event => {
        item.action(item.params);
        this.props.onClose();
      };

      return (
        <li key={item.actionType}>
          <button className="form-action" onClick={itemOnClick}>
            <span key={item.actionType}>{item.text}</span>
          </button>
        </li>
      );
    });

    const position = {
      top: `${eventData.currentPoints.page.y}px`,
      left: `${eventData.currentPoints.page.x}px`
    };

    return (
      <div className="ToolContextMenu dropdown" style={position}>
        <ul className="dropdown-menu dropdown-menu-left bounded">
          {dropdownComponents}
        </ul>
      </div>
    );
  }
}

ToolContextMenu.propTypes = {
  toolContextMenuData: PropTypes.object, // or null
  onClose: PropTypes.func.isRequired
};

export default ToolContextMenu;
