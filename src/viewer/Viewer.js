import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Logo from '../shared/Logo.js';
import CornerstoneViewport from './CornerstoneViewport.js';
import ActiveToolbar from './ActiveToolbar.js';
import CaseControlButtons from './CaseControlButtons.js';
import CaseProgress from './CaseProgress.js';
import MeasurementControl from './MeasurementControl.js';

import getNextCase from '../case/getNextCase.js';
import getUsername from './lib/getUsername.js';

import clearOldCornerstoneCacheData from './lib/clearOldCornerstoneCacheData.js';

import saveMeasurementToDatabase from './lib/saveMeasurementToDatabase.js';
import saveSkipToDatabase from './lib/saveSkipToDatabase.js';
import saveAchievementsToDatabase from './lib/saveAchievementsToDatabase.js';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

import viewerCommands from './lib/viewerCommands.js';
import LoadingIndicator from '../shared/LoadingIndicator.js';

import './Viewer.css';

import NotificationContainer from '../notifications/NotificationContainer';
import NotificationService from '../notifications/NotificationService.js';
import getImageIdsForSeries from './lib/getImageIdsForSeries.js';

const EVENT_KEYDOWN = 'keydown';

const hotkeyFunctions = {
  ArrowDown: () => viewerCommands.scrollActiveElement(1),
  ArrowUp: () => viewerCommands.scrollActiveElement(-1),
  '1': () => viewerCommands.setWLPresetSoftTissue(),
  '2': () => viewerCommands.setWLPresetLung(),
  '3': () => viewerCommands.setWLPresetLiver(),
  '4': () => viewerCommands.setWLPresetBrain()
};

class Viewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      magnificationActive: false,
      labelSelectTreeOrigin: null,
      displayLabelSelectTree: false,
      currentLesionFocused: false,
      feedback: [],
      hasMeasurements: false,
      currentLesion: 0,
      toolData: []
    };

    this.toggleMagnification = this.toggleMagnification.bind(this);
    this.getNextCase = this.getNextCase.bind(this);
    this.skipCase = this.skipCase.bind(this);
    this.saveCase = this.saveCase.bind(this);
    this.isSaveEnabled = this.isSaveEnabled.bind(this);
    this.isSkipEnabled = this.isSkipEnabled.bind(this);
    this.feedbackChanged = this.feedbackChanged.bind(this);
    this.focusCurrentLesion = this.focusCurrentLesion.bind(this);
    this.measurementsAddedOrRemoved = this.measurementsAddedOrRemoved.bind(
      this
    );
    this.measurementsChanged = this.measurementsChanged.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.toggleLabelSelectTree = this.toggleLabelSelectTree.bind(this);
    this.labelDoneCallback = this.labelDoneCallback.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
    this.setCurrentLesion = this.setCurrentLesion.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener(EVENT_KEYDOWN, this.onKeyDown);

    this.getNextCase();

    // We need to prevent scrolling / elastic banding
    // of the viewer page by the browser
    document.body.classList.add('fixed-page');
  }

  componentWillUnmount() {
    clearOldCornerstoneCacheData();

    document.body.removeEventListener(EVENT_KEYDOWN, this.onKeyDown);
    document.body.classList.remove('fixed-page');

    this.props.resetSession();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.caseData.data &&
      this.props.caseData.data.studyInstanceUid !==
        prevProps.caseData.data.studyInstanceUid &&
      this.props.caseData.data.seriesInstanceUid !==
        prevProps.caseData.data.seriesInstanceUid
    ) {
      this.getNextCase();
    }

    if (this.state.labelSelectTreeOrigin && !this.state.hasMeasurements) {
      this.setState({ labelSelectTreeOrigin: null });
    }

    // Force closing labelSelectTree on user interactions not related to label
    if (
      prevState.displayLabelSelectTree === this.state.displayLabelSelectTree &&
      this.state.displayLabelSelectTree &&
      (this.state.labelSelectTreeOrigin === null || this.state.hasMeasurements)
    ) {
      this.setState({ displayLabelSelectTree: false });
    }

    NotificationService.setCaseMeasurements(this.state.toolData.length);
  }

  onNewImage() {
    this.setState({
      currentLesionFocused: false
    });
  }

  getNextCase() {
    const props = this.props;
    console.log('asking for the next case');
    props.fetchCaseRequest();
    this.setState({
      loading: true,
      feedback: [],
      hasMeasurements: false,
      currentLesion: 0,
      toolData: []
    });

    clearOldCornerstoneCacheData(this.state.prefetchedCase);

    const username = getUsername();

    function nextCaseRejector(args) {
      // when there is no valid next case
      console.log('Finished collection - returning to dashboard');
      props.history.push('/');
      props.fetchCaseFailure(args);
    }

    const nextCaseResolver = (nextCase) => {
      console.log('next case', nextCase);
      props.fetchCaseSuccess(nextCase);
      this.setState({ loading: false });

      // Prefetch next case ignoring the current to prevent loading it twice
      const caseToIgnore = nextCase.data._id;
      getNextCase(this.props.collection, username, caseToIgnore)
        .then(
          prefetchedCase => this.setState({ prefetchedCase }),
          nextCaseRejector
        );
    }

    const { prefetchedCase } = this.state;
    if (prefetchedCase) {
      nextCaseResolver(prefetchedCase);
      return Promise.resolve(prefetchedCase);
    }

    return getNextCase(this.props.collection, username)
      .then(nextCaseResolver, nextCaseRejector);
  }

  getViewportData() {
    const seriesData = this.props.caseData.seriesData;
    const imageIds = getImageIdsForSeries(seriesData);

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
              measurementsAddedOrRemoved={this.measurementsAddedOrRemoved}
              measurementsChanged={this.measurementsChanged}
              currentLesionFocused={this.state.currentLesionFocused}
              magnificationActive={this.state.magnificationActive}
              viewportData={item}
              activeTool={activeTool}
              labelSelectTreeOrigin={this.state.labelSelectTreeOrigin}
              displayLabelSelectTree={this.state.displayLabelSelectTree}
              labelDoneCallback={this.labelDoneCallback}
              onNewImage={this.onNewImage}
              setCurrentLesion={this.setCurrentLesion}
              prefetchedCase={this.state.prefetchedCase}
            />
          ) : (
            <LoadingIndicator />
          )}
        </div>
      );
    });

    return (
      <div className="Viewer">
        <NotificationContainer />
        <div className="viewport-section">
          {this.state.loading ? <LoadingIndicator /> : items}
        </div>
        <Logo />
        <div className="ViewportControl d-flex">
          <ActiveToolbar />
          <MeasurementControl
            disabled={!this.state.hasMeasurements}
            previous={this.previous}
            next={this.next}
            number={this.state.currentLesion}
            onLabelClick={this.toggleLabelSelectTree}
            onMagnifyClick={this.toggleMagnification}
            magnificationActive={this.state.magnificationActive}
            focusCurrentLesion={this.focusCurrentLesion}
          />
        </div>
        <div className="SessionControl">
          <CaseProgress
            sessionMeasurements={this.props.measurementsInCurrentSession}
            caseMeasurements={this.state.toolData.length}
            sessionStart={this.props.sessionStart}
            totalCompleteCollection={this.props.totalCompleteCollection}
            current={this.props.current}
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
    // TODO: probably a better way to find the stack
    const enabledElement = cornerstone.getEnabledElements()[0];
    const { element } = enabledElement;
    const stackData = cornerstoneTools.getToolState(element, 'stack');
    const stack = stackData.data[0];

    // Retrieve the tool data from this Object
    let toolData = [];
    measurements.forEach(measurement => {
      const { toolType, imageId } = measurement;
      const data = toolState[imageId][toolType].data;
      const generalSeriesModule = cornerstone.metaData.get(
        'generalSeriesModule',
        imageId
      );
      const sopCommonModule = cornerstone.metaData.get(
        'sopCommonModule',
        imageId
      );
      const imageIndex = stack.imageIds.indexOf(imageId);
      const tool = data.find(a => a._id === measurement._id);

      toolData.push({
        ...tool,
        studyInstanceUID: generalSeriesModule.studyInstanceUID,
        seriesInstanceUID: generalSeriesModule.seriesInstanceUID,
        sopInstanceUID: sopCommonModule.sopInstanceUID,
        sopClassUID: sopCommonModule.sopClassUID,
        imageIndex,
        viewport: measurement.viewport,
        toolType,
        imageId
      });
    });

    return toolData;
  }

  saveCase() {
    const { caseData, totalCompleteCollection } = this.props;
    const { feedback } = this.state;

    const measurements = this.getMeasurementData();
    this.props.incrementNumMeasurementsInSession(measurements.length);

    saveMeasurementToDatabase(caseData, measurements, feedback).then(() => {
      this.getNextCase();

      // Determine and save the earned achievements
      // after measurements are saved to db
      saveAchievementsToDatabase(totalCompleteCollection);
    });
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

    const { caseData, totalCompleteCollection } = this.props;

    saveSkipToDatabase(caseData, this.state.feedback).then(() => {
      this.getNextCase();

      // Determine and save the earned achievements
      // after skips are saved to db
      saveAchievementsToDatabase(totalCompleteCollection);
    });
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
      currentLesionFocused: true,
      magnificationActive: false
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
      currentLesionFocused: true,
      magnificationActive: false
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

  setCurrentLesion(currentLesion) {
    this.setState({ currentLesion });
  }

  focusCurrentLesion() {
    this.setState({
      currentLesionFocused: true
    });
  }

  toggleMagnification() {
    const magnificationActive = !this.state.magnificationActive;
    this.setState({ magnificationActive });
  }

  toggleLabelSelectTree(event) {
    const {
      hasMeasurements,
      displayLabelSelectTree: _displayLabelSelectTree
    } = this.state;
    if (hasMeasurements) {
      this.focusCurrentLesion();
      const newValue = event.target;
      const displayLabelSelectTree = !_displayLabelSelectTree;
      this.setState({
        labelSelectTreeOrigin: newValue,
        displayLabelSelectTree
      });
    }
  }

  labelDoneCallback() {
    this.setState({
      labelSelectTreeOrigin: null,
      displayLabelSelectTree: false
    });
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
