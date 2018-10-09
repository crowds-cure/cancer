import { Component } from 'react';
import React from 'react';
import CornerstoneViewport from './viewer/CornerstoneViewport.js';
import ToolbarSection from './viewer/ToolbarSection.js';
import CaseControlButtons from './viewer/CaseControlButtons.js';

import getNextCase from './case/getNextCase.js';

import clearOldCornerstoneCacheData from './viewer/clearOldCornerstoneCacheData.js';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

import './Viewer.css';

class Viewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewportData: []
    };

    getNextCase().then(seriesData => {
      clearOldCornerstoneCacheData();

      const series = seriesData[0];
      let imageIds = [];

      series.forEach(instance => {
        // TODO: use this
        //const numberOfFrames = instance['00280008'].Value;

        instance['7FE00010'].BulkDataURI = instance[
          '7FE00010'
        ].BulkDataURI.replace('http://', 'https://');

        const imageId = 'wadors:' + instance['7FE00010'].BulkDataURI;
        imageIds.push(imageId);

        cornerstoneWADOImageLoader.wadors.metaDataManager.add(
          imageId,
          instance
        );
      });

      imageIds = imageIds.sort((a, b) => {
        const imagePlaneA = cornerstone.metaData.get('imagePlaneModule', a);
        const imagePlaneB = cornerstone.metaData.get('imagePlaneModule', b);

        debugger;

        return (
          imagePlaneA.imagePositionPatient[2] -
          imagePlaneB.imagePositionPatient[2]
        );
      });

      this.setState({
        viewportData: [
          {
            stack: {
              imageIds,
              currentImageIdIndex: 0
            }
          }
        ]
      });
    });
  }

  render() {
    const viewportData = this.state.viewportData;

    const items = viewportData.map((item, index) => {
      if (item.plugin && item.plugin !== 'cornerstone') {
        throw new Error(
          'Only Cornerstone-based Viewports are currently supported.'
        );
      }

      return (
        <div key={index} className="viewport">
          {item ? <CornerstoneViewport viewportData={item} /> : 'Loading'}
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
