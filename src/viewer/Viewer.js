import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import CornerstoneViewport from './CornerstoneViewport.js';
import ActiveToolbar from './ActiveToolbar.js';
import CaseControlButtons from './CaseControlButtons.js';
import MeasurementControl from './MeasurementControl.js';
import HeaderSection from './HeaderSection.js';

import getNextCase from '../case/getNextCase.js';

import clearOldCornerstoneCacheData from './lib/clearOldCornerstoneCacheData.js';

import saveMeasurementToDatabase from './lib/saveMeasurementToDatabase.js';
import saveSkipToDatabase from './lib/saveSkipToDatabase.js';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as cornerstoneTools from 'cornerstone-tools';

import viewerCommands from './lib/viewerCommands.js';
import LoadingIndicator from '../shared/LoadingIndicator.js';

import './Viewer.css';

const EVENT_KEYDOWN = 'keydown';

const hotkeyFunctions = {
  ArrowDown: () => viewerCommands.scrollActiveElement(1),
  ArrowUp: () => viewerCommands.scrollActiveElement(-1),
  '1': () => viewerCommands.setWLPresetSoftTissue(),
  '2': () => viewerCommands.setWLPresetLung(),
  '3': () => viewerCommands.setWLPresetLiver()
};

class Viewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      feedback: [],
      hasMeasurements: false,
      currentLesion: 0,
      toolData: []
    };

    this.getNextCase = this.getNextCase.bind(this);
    this.skipCase = this.skipCase.bind(this);
    this.saveCase = this.saveCase.bind(this);
    this.isSaveEnabled = this.isSaveEnabled.bind(this);
    this.isSkipEnabled = this.isSkipEnabled.bind(this);
    this.feedbackChanged = this.feedbackChanged.bind(this);
    this.measurementsChanged = this.measurementsChanged.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener(EVENT_KEYDOWN, this.onKeyDown);

    this.getNextCase();

    // We need to prevent scrolling / elastic banding
    // of the viewer page by the browser
    document.body.classList.add('fixed-page');
  }

  componentWillUnmount() {
    document.body.removeEventListener(EVENT_KEYDOWN, this.onKeyDown);
    document.body.classList.remove('fixed-page');
  }

  componentDidUpdate(prevProps) {
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
    this.setState({
      loading: true,
      feedback: [],
      hasMeasurements: false,
      currentLesion: 0,
      toolData: []
    });

    clearOldCornerstoneCacheData();

    return getNextCase(this.props.collection)
      .then(props.fetchCaseSuccess, props.fetchCaseFailure)
      .then(() => {
        this.setState({
          loading: false
        });
      });
  }

  getViewportData() {
    const seriesData = this.props.caseData.seriesData;
    if (!seriesData || !seriesData.length) {
      return [];
    }

    const seriesInstances = seriesData[0];
    let imageIds = seriesInstances.map(instance => {
      // TODO: use this
      //const numberOfFrames = instance['00280008'].Value;

      instance['7FE00010'].BulkDataURI = instance[
        '7FE00010'
      ].BulkDataURI.replace('http://', 'https://');

      const imageId = 'wadors:' + instance['7FE00010'].BulkDataURI;

      const instanceLowerCaseKeys = {};
      Object.keys(instance).forEach(key => {
        instanceLowerCaseKeys[key.toLowerCase()] = instance[key];
      });

      cornerstoneWADOImageLoader.wadors.metaDataManager.add(
        imageId,
        instanceLowerCaseKeys
      );

      return imageId;
    });

    imageIds = imageIds.sort((a, b) => {
      const instanceA = cornerstone.metaData.get('instance', a);
      const instanceB = cornerstone.metaData.get('instance', b);
      const instanceNumberA = instanceA['00200013'].Value[0];
      const instanceNumberB = instanceB['00200013'].Value[0];

      return instanceNumberA - instanceNumberB;
    });

    return [
      {
        stack: {
          imageIds,
          currentImageIdIndex: 0
        }
      }
    ];
  }

  render() {
    if (!this.props.collection) {
      return <Redirect to="/" />;
    }

    const viewportData = this.getViewportData();

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
            <CornerstoneViewport
              currentLesion={this.state.currentLesion}
              toolData={this.state.toolData}
              measurementsChanged={this.measurementsChanged}
              viewportData={item}
              activeTool={activeTool}
            />
          ) : (
            <LoadingIndicator />
          )}
        </div>
      );
    });

    return (
      <div className="Viewer">
        <div>
          <HeaderSection
            sessionStart={this.props.sessionStart}
            casesInCurrentSession={this.props.casesInCurrentSession}
          />
        </div>
        <div className="toolbar-row">
          <ActiveToolbar />
          <MeasurementControl
            disabled={!this.state.hasMeasurements}
            previous={this.previous}
            next={this.next}
            number={this.state.currentLesion}
          />
          <CaseControlButtons
            feedbackChanged={this.feedbackChanged}
            saveEnabled={this.isSaveEnabled()}
            saveCase={this.saveCase}
            skipEnabled={this.isSkipEnabled()}
            skipCase={this.skipCase}
          />
        </div>
        <div className="viewport-section">
          {this.state.loading ? <LoadingIndicator /> : items}
        </div>
      </div>
    );
  }

  getMeasurementData() {
    const toolStateManager =
      cornerstoneTools.globalImageIdSpecificToolStateManager;

    // Dump all of its tool state into an Object
    const toolState = toolStateManager.saveToolState();

    // Get the stack tool data
    //const stackData = cornerstoneTools.getToolState(element, 'stack');
    //const stack = stackData.data[0];

    // Retrieve the length data from this Object
    let lengthData = [];
    const toolType = 'length';
    Object.keys(toolState).forEach(imageId => {
      const toolDataForImage = toolState[imageId];
      if (
        !toolDataForImage[toolType] ||
        !toolDataForImage[toolType].data.length
      ) {
        return;
      }

      lengthData.push(toolDataForImage[toolType]);
    });

    if (lengthData.length > 1) {
      throw new Error(
        'Only one length measurement should be in the lengthData'
      );
    }

    return lengthData;
  }

  saveCase() {
    const { caseData } = this.props;

    this.props.incrementNumCasesInSession();
    const measurements = this.getMeasurementData();
    saveMeasurementToDatabase(caseData, measurements);
    console.log('saveCase!');
    this.getNextCase();
  }

  isSaveEnabled() {
    // Do not allow saving unless at least one measurement exists
    return this.state.hasMeasurements === true;
  }

  skipCase() {
    //const stack = cornerstoneTools.getToolState(element, "stack");
    // const sliceIndex = stack.data[0].currentImageIdIndex;
    //instanceUID: window.rsnaCrowdQuantCaseStudy.instanceUIDs[sliceIndex],
    //instanceURL: window.rsnaCrowdQuantCaseStudy.urls[sliceIndex],
    //sliceIndex,

    const { caseData } = this.props;
    saveSkipToDatabase(caseData);
    this.getNextCase();
  }

  isSkipEnabled() {
    // Do not allow skipping unless at least one feedback
    // option has been selected
    return this.state.feedback && this.state.feedback.length > 0;
  }

  feedbackChanged(feedbackObject) {
    // The CaseFeedback component calls this callback with the Object
    // which describes which options are selected.
    const feedback = Array.from(feedbackObject.selected);

    this.setState({
      feedback
    });
  }

  measurementsChanged(action, imageId, toolType, measurementData) {
    let updatedToolData = this.state.toolData;
    let currentLesion = this.state.currentLesion;

    if (action === 'added') {
      updatedToolData.push({
        imageId,
        ...measurementData
      });

      // TOOD: Update the current lesion if we add new ones
      // We can't use this right now because it inadvertently
      // forces an update while the user is still placing the
      // measurement.
      // currentLesion = updatedToolData.length - 1;
    } else {
      const index = updatedToolData.indexOf(measurementData);
      updatedToolData.splice(index, 1);
    }
    const hasMeasurements = this.state.toolData.length > 0;

    if (currentLesion === 0 && hasMeasurements) {
      currentLesion = 1;
    } else if (!hasMeasurements) {
      currentLesion = 0;
    }

    this.setState({
      hasMeasurements,
      toolData: updatedToolData,
      currentLesion
    });
  }

  previous() {
    const { currentLesion, toolData } = this.state;
    const numberOfLesions = toolData.length;
    if (numberOfLesions === 0) {
      return;
    }

    let previousLesion;
    if (currentLesion === 1) {
      previousLesion = numberOfLesions;
    } else {
      previousLesion = currentLesion - 1;
    }

    this.setState({
      currentLesion: previousLesion
    });
  }

  next() {
    const { currentLesion, toolData } = this.state;
    const numberOfLesions = toolData.length;
    if (numberOfLesions === 0) {
      return;
    }

    let nextLesion;
    if (currentLesion === numberOfLesions) {
      nextLesion = 1;
    } else {
      nextLesion = currentLesion + 1;
    }

    this.setState({
      currentLesion: nextLesion
    });
  }

  onKeyDown(event) {
    console.warn(event);
    const hotkeyFn = hotkeyFunctions[event.key];
    if (hotkeyFn) {
      hotkeyFn();

      event.stopPropagation();
      event.preventDefault();

      // return false to prevent default browser behavior
      // and stop event from bubbling
      return false;
    }
  }
}

Viewer.propTypes = {
  collection: PropTypes.string,
  caseData: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  activeTool: PropTypes.string.isRequired,
  casesInCurrentSession: PropTypes.number.isRequired
};

export default Viewer;
