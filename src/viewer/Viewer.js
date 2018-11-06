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
    this.measurementsAddedOrRemoved = this.measurementsAddedOrRemoved.bind(
      this
    );
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
              currentLesion={this.state.lesionSelected}
              toolData={this.state.toolData}
              measurementsAddedOrRemoved={this.measurementsAddedOrRemoved}
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
            measurementsInCurrentSession={
              this.props.measurementsInCurrentSession
            }
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
            feedbackSelected={this.state.feedback}
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

    const measurements = this.state.toolData;

    // Get the stack tool data
    //const stackData = cornerstoneTools.getToolState(element, 'stack');
    //const stack = stackData.data[0];

    // Retrieve the tool data from this Object
    let toolData = [];
    measurements.forEach(measurement => {
      const { toolType, imageId } = measurement;
      const data = toolState[imageId][toolType].data;
      const tool = data.find(a => a._id === measurement._id);
      toolData.push({
        ...tool,
        viewport: measurement.viewport,
        toolType,
        imageId
      });
    });

    return toolData;
  }

  saveCase() {
    const { caseData } = this.props;

    const measurements = this.getMeasurementData();
    this.props.incrementNumMeasurementsInSession(measurements.length);

    saveMeasurementToDatabase(caseData, measurements, this.state.feedback);

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
    saveSkipToDatabase(caseData, this.state.feedback);
    this.getNextCase();
  }

  isSkipEnabled() {
    // Do not allow skipping unless at least one feedback
    // option has been selected
    return this.state.feedback && this.state.feedback.length > 0;
  }

  feedbackChanged(feedback) {
    // The CaseFeedback component calls this callback with
    // an Array which describes which options are selected.
    this.setState({
      feedback
    });
  }

  measurementsAddedOrRemoved(action, imageId, toolType, measurementData) {
    let updatedToolData = this.state.toolData;
    let currentLesion = this.state.currentLesion;

    if (action === 'added') {
      updatedToolData.push({
        imageId,
        toolType,
        ...measurementData
      });

      currentLesion = updatedToolData.length;
    } else {
      const index = updatedToolData.findIndex(
        data => data._id === measurementData._id
      );
      updatedToolData.splice(index, 1);
    }

    const hasMeasurements = this.state.toolData.length > 0;

    if (currentLesion === 0 && hasMeasurements) {
      currentLesion = 1;
    } else if (!hasMeasurements) {
      currentLesion = 0;
    } else if (currentLesion > this.state.toolData.length) {
      currentLesion = currentLesion - 1;
    }

    this.setState({
      hasMeasurements,
      toolData: updatedToolData,
      currentLesion
    });
  }

  measurementsChanged() {
    console.log('changed');
    // TODO: Get VOI of image, in case it has changed
    // TODO: Update this.state.toolData;
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
      currentLesion: previousLesion,
      lesionSelected: previousLesion
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
      currentLesion: nextLesion,
      lesionSelected: nextLesion
    });
  }

  onKeyDown(event) {
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
  measurementsInCurrentSession: PropTypes.number.isRequired
};

export default Viewer;
