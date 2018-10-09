import { Component } from 'react';
import React from 'react';
import CornerstoneViewport from './viewer/CornerstoneViewport.js';
import ToolbarSection from './viewer/ToolbarSection.js';
import CaseControlButtons from './viewer/CaseControlButtons.js';

import getNextCase from './case/getNextCase.js';

import clearOldCornerstoneCacheData from './viewer/clearOldCornerstoneCacheData.js';
import './Viewer.css';

class Viewer extends Component {
  constructor(props) {
    super(props);

    getNextCase();
  }

  render() {
    clearOldCornerstoneCacheData();

    const viewportData = [
      {
        plugin: 'cornerstone'
      }
    ];

    const items = viewportData.map((item, index) => {
      if (item.plugin !== 'cornerstone') {
        throw new Error(
          'Only Cornerstone-based Viewports are currently supported.'
        );
      }

      return (
        <div key={index} className="viewport">
          <CornerstoneViewport viewportData={item} />
        </div>
      );
    });

    return (
      <div className="Viewer">
        <div className="toolbar-row">
          <ToolbarSection />
          <CaseControlButtons />
        </div>
        <div className="viewport-section">{items}</div>
      </div>
    );
  }
}

export default Viewer;
