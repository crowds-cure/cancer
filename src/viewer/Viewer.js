import { Component } from 'react';
import React from 'react';
import CornerstoneViewport from './CornerstoneViewport.js';
import ActiveToolbar from './ActiveToolbar.js';
import CaseControlButtons from './CaseControlButtons.js';

import getNextCase from '../case/getNextCase.js';

import clearOldCornerstoneCacheData from './lib/clearOldCornerstoneCacheData.js';

import saveMeasurementToDatabase from './lib/saveMeasurementToDatabase.js';
import saveSkipToDatabase from './lib/saveSkipToDatabase.js';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as cornerstoneTools from 'cornerstone-tools';

import LoadingIndicator from '../shared/LoadingIndicator.js';
import './Viewer.css';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { Redirect } from 'react-router-dom';
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
      showInstructionsModal: false
    };

    this.getNextCase = this.getNextCase.bind(this);
    this.skipCase = this.skipCase.bind(this);
    this.saveCase = this.saveCase.bind(this);
    this.feedbackChanged = this.feedbackChanged.bind(this);

    this.toggleModal = this.toggleModal.bind(this);
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
            <CornerstoneViewport viewportData={item} activeTool={activeTool} />
          ) : (
            <LoadingIndicator />
          )}
        </div>
      );
    });

    return (
      <div className="Viewer">
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
          <CaseControlButtons
            feedbackChanged={this.feedbackChanged}
            saveCase={this.saveCase}
            skipCase={this.skipCase}
            casesInCurrentSession={this.props.casesInCurrentSession}
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

  feedbackChanged(feedback) {
    console.warn('feedbackChanged');
    console.warn(feedback);
  }

  toggleModal() {
    this.setState({ showInstructionsModal: !this.state.showInstructionsModal });
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
