import { Component } from 'react';
import React from 'react';
import Modal from 'react-modal';

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

class InstructionsModal extends Component {

  render() {
    return (
      <Modal
        isOpen={this.props.visible}
        contentLabel="Instructions"
        onRequestClose={this.props.toggle}
        styles={customStyles}
        className="Modal"
        overlayClassName="Overlay"
        closeTimeoutMS={200}
      >
        <h1>Instructions</h1>
        <h2>Create</h2>
        <ul>
          <li>
            <p>
              Measure all of the metastatic lesions or lesions that may mimic
              metastatic disease that you find. There is no minimum size for
              lesion measurement. You will get 1 point for each measurement.
            </p>
          </li>
          <li>
            <p>
              Label the lesion (e.g. liver, lung, etc.) to add value. Use the
              ‘previous’ and ‘next’ lesion buttons to review your measurements.
            </p>
          </li>
          <li>
            <p>
              Provide case feedback regarding image quality and/or presence of
              disease. Feedback is only required if you want to skip the case.
            </p>
          </li>
          <li>
            <p>
              Return to the dashboard at any time to view another imaging
              collection. End the session (logout) when you are finished.
            </p>
          </li>
        </ul>
        <h2>Compete</h2>
        <ul>
          <li>
            <p>
              Log back in with your email or anonymous username to measure more
              cases. Measurements can be made on any personal device; you are
              not restricted to Crowds Cure Cancer workstations.
            </p>
          </li>
          <li>
            <p>
              Track your personal progress and the progress of other RSNA
              attendees. The leaderboard will show the top individual readers,
              and teams for RSNA 2019.
            </p>
          </li>
        </ul>
        <h2>Contribute</h2>
        <ul>
          <li>
            <p>
              Detailed results will be posted after RSNA. Visit{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.cancerimagingarchive.net/"
              >
                The Cancer Imaging Archive
              </a>{' '}
              to view results from{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://doi.org/10.7937/K9/TCIA.2018.OW73VLO2"
              >
                RSNA 2017
              </a>{' '}
              and{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://doi.org/10.7937/TCIA.2019.yk0gm1eb"
              >
                RSNA 2018
              </a>
              .
            </p>
          </li>
          <li>
            <p>
              Interested in donating data to this project? Please visit the{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.cancerimagingarchive.net/primary-data/"
              >
                TCIA website
              </a>{' '}
              to find out how.
            </p>
          </li>
        </ul>
        <span className="modal-close" onClick={this.props.toggle}>
          Close
        </span>
      </Modal>
    );
  }

}

export default InstructionsModal;
