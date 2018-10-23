import { Component } from 'react';
import React from 'react';
import CornerstoneViewport from './CornerstoneViewport.js';
import ActiveToolbar from './ActiveToolbar.js';
import CaseControlButtons from './CaseControlButtons.js';

import getNextCase from '../case/getNextCase.js';

import clearOldCornerstoneCacheData from './lib/clearOldCornerstoneCacheData.js';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

import './Viewer.css';

class Viewer extends Component {
  constructor(props) {
    super(props);

    this.getNextCase = this.getNextCase.bind(this);
  }
  componentDidMount() {
    this.getNextCase();
  }

  componentDidUpdate(prevProps) {
    debugger;
    if (
      prevProps.caseData.data &&
      this.props.caseData.data.studyInstanceUid !==
        prevProps.caseData.data.studyInstanceUid &&
      this.props.caseData.data.seriesInstanceUid !==
        prevProps.caseData.data.seriesInstanceUid
    ) {
      this.getNextCase();
    }
  }

  getNextCase() {
    const props = this.props;

    props.fetchCaseRequest();
    getNextCase().then(props.fetchCaseSuccess, props.fetchCaseFailure);
  }

  render() {
    const seriesData = this.props.caseData.seriesData;
    let viewportData = [];
    if (seriesData && seriesData.length) {
      clearOldCornerstoneCacheData();

      const seriesInstances = seriesData[0];
      let imageIds = seriesInstances.map(instance => {
        // TODO: use this
        //const numberOfFrames = instance['00280008'].Value;

        instance['7FE00010'].BulkDataURI = instance[
          '7FE00010'
        ].BulkDataURI.replace('http://', 'https://');

        const imageId = 'wadors:' + instance['7FE00010'].BulkDataURI;

        cornerstoneWADOImageLoader.wadors.metaDataManager.add(
          imageId,
          instance
        );

        return imageId;
      });

      imageIds = imageIds.sort((a, b) => {
        const imagePlaneA = cornerstone.metaData.get('imagePlaneModule', a);
        const imagePlaneB = cornerstone.metaData.get('imagePlaneModule', b);

        return (
          imagePlaneA.imagePositionPatient[2] -
          imagePlaneB.imagePositionPatient[2]
        );
      });

      viewportData = [
        {
          stack: {
            imageIds,
            currentImageIdIndex: 0
          }
        }
      ];
    }

    const activeTool = this.props.activeTool;
    const items = viewportData.map((item, index) => {
      if (item.plugin && item.plugin !== 'cornerstone') {
        throw new Error(
          'Only Cornerstone-based Viewports are currently supported.'
        );
      }

      return (
        <div key={index} className="viewport">
          {item ? (
            <CornerstoneViewport viewportData={item} activeTool={activeTool} />
          ) : (
            'Loading'
          )}
        </div>
      );
    });

    return (
      <div className="Viewer">
        <div className="toolbar-row">
          <ActiveToolbar />
          <CaseControlButtons />
        </div>
        <div className="viewport-section">{items}</div>
      </div>
    );
  }
}

export default Viewer;
