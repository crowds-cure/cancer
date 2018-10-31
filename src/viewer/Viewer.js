import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
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

import LoadingIndicator from '../shared/LoadingIndicator.js';

import './Viewer.css';
import '../shared/Modal.css';

Modal.defaultStyles.overlay.backgroundColor = 'black';
Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class Viewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showInstructionsModal: false,
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
    this.toggleModal = this.toggleModal.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }

  componentDidMount() {
    this.getNextCase();

    // We need to prevent scrolling / elastic banding
    // of the viewer page by the browser
    document.body.classList.add('fixed-page');
  }

  componentWillUnmount() {
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
      loading: true
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
      const imagePlaneA = cornerstone.metaData.get('imagePlaneModule', a);
      const imagePlaneB = cornerstone.metaData.get('imagePlaneModule', b);

      return (
        imagePlaneA.imagePositionPatient[2] -
        imagePlaneB.imagePositionPatient[2]
      );
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
            casesInCurrentSession={this.props.casesInCurrentSession}
          />
        </div>
        <div className="toolbar-row">
          <ActiveToolbar />
          <button onClick={this.toggleModal}>Instructions</button>
          <Modal
            isOpen={this.state.showInstructionsModal}
            contentLabel="Instructions"
            onRequestClose={this.toggleModal}
            styles={customStyles}
            className="Modal"
            overlayClassName="Overlay"
            closeTimeoutMS={200}
          >
            <h1>Instructions</h1>
            <p>Measure all lesions you can find.</p>
            <span className="modal-close" onClick={this.toggleModal}>
              Close
            </span>
          </Modal>
          <MeasurementControl
            previous={this.previous}
            next={this.next}
            number={this.state.currentLesion}
          />
          <CaseControlButtons
            sessionStart={this.props.sessionStart}
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
    if (action === 'added') {
      updatedToolData.push({
        imageId,
        ...measurementData
      });
    } else {
      const index = updatedToolData.indexOf(measurementData);
      updatedToolData.splice(index, 1);
    }
    const hasMeasurements = this.state.toolData.length > 0;

    let currentLesion = this.state.currentLesion;
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

  toggleModal() {
    this.setState({ showInstructionsModal: !this.state.showInstructionsModal });
  }

  previous() {
    const { currentLesion, toolData } = this.state;
    const numberOfLesions = toolData.length;

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
}

Viewer.propTypes = {
  collection: PropTypes.string,
  caseData: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  activeTool: PropTypes.string.isRequired,
  casesInCurrentSession: PropTypes.number.isRequired
};

export default Viewer;
