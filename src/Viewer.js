import { Component } from 'react';
import React from 'react';
import CornerstoneViewport from './viewer/CornerstoneViewport.js';
import ToolbarSection from './viewer/ToolbarSection.js';
import clearOldCornerstoneCacheData from './viewer/clearOldCornerstoneCacheData.js';
import './Viewer.css';

class Viewer extends Component {
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

      return <CornerstoneViewport key={index} viewportData={item} />;
    });

    return (
      <div className="Viewer">
        <ToolbarSection />
        <div>{items}</div>
      </div>
    );
  }
}

export default Viewer;
