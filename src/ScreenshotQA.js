import { Component } from 'react';
import React from 'react';
import ReactPaginate from 'react-paginate';

import { getDB } from './db.js';
import SimpleHeaderSection from './shared/SimpleHeaderSection';
import SecuredImage from './shared/SecuredImage.js';
import getAuthorizationHeader from './openid-connect/getAuthorizationHeader.js';

import './ScreenshotQA.css';

async function getAnnotators(measurementsDB) {
  const result = await measurementsDB.query('by/annotatorsIDs');
  const annotators = [];

  if (!result.rows || !result.rows[0]) {
    return annotators;
  }

  result.rows.forEach(row => {
    if (!annotators.includes(row.value) && row.value !== null) {
      annotators.push(row.value);
    }
  });

  return annotators;
}

async function getTotalMeasurements(measurementsDB, annotator) {
  const result = await measurementsDB.query('by/annotators', {
    selector: {
      annotator: annotator
    }
  });

  if (!result.rows || !result.rows[0]) {
    return 0;
  }

  return result.rows[0].value;
}

async function getMeasurements(measurementsDB, options = {}) {
  let { limit = 25, skip = 0, sortDate = 'desc', annotator } = options;
  const queryOptions = {
    selector: {
      skip: false
    },
    fields: ['_id', 'date', 'annotator', 'caseData', 'feedback'],
    sort: [{ date: sortDate }],
    limit: limit,
    skip: skip
  };
  if (annotator) {
    queryOptions.selector['annotator'] = annotator;
  }

  const result = await measurementsDB.find(queryOptions);

  return result.docs;
}

// TODO: Centralize this somewhere
const options = [
  {
    value: 'InadequateIVContrast',
    label: 'Inadequate IV contrast'
  },
  {
    value: 'NoIVContrast',
    label: 'No IV contrast'
  },
  {
    value: 'MotionArtifact',
    label: 'Motion artifact'
  },
  {
    value: 'MissingAnatomy',
    label: 'Missing anatomy'
  },
  {
    value: 'PoorImageQualityOther',
    label: 'Poor image quality, other'
  },
  {
    value: 'ContainsMultiPhaseImages',
    label: 'Contains multi-phase images'
  },
  {
    value: 'NoDiseaseIdentified',
    label: 'No disease identified'
  },
  {
    value: 'NoMeasurableDisease',
    label: 'No measurable disease'
  },
  {
    value: 'LikelyBenign',
    label: 'Likely benign'
  },
  {
    value: 'DidntMeasureEverything',
    label: 'Didn’t measure everything'
  },
  {
    value: 'NoneJustWantToSkip',
    label: 'None, just want to skip'
  }
];

class ScreenshotQA extends Component {
  static defaultProps = {
    screenshotPerPage: 10
  };

  constructor(props) {
    super(props);

    this.state = {
      pageNumber: 0,
      totalMeasurements: 0,
      userMeasurements: 0,
      screenshotPerPage: this.props.screenshotPerPage,
      measurements: [],
      annotator: null
    };

    this.measurementsDB = getDB('measurements');
    getAnnotators(this.measurementsDB).then(annotators => {
      this.annotators = annotators;
    });
    this.updateMeasurements();
  }

  render() {
    debugger;
    const { totalMeasurements, screenshotPerPage } = this.state;
    const pageCount = Math.ceil(totalMeasurements / screenshotPerPage) || 0;
    return (
      <div className="ScreenshotQA">
        <SimpleHeaderSection />
        <div className="controlHeader">
          <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            pageCount={pageCount}
            marginPagesDisplayed={4}
            pageRangeDisplayed={4}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
          {this.annotators && (
            <div className="usernameField">
              <label htmlFor="username">Username search:</label>
              <select id="username" onChange={this.annoratorSelected}>
                <option value={null}>No annotator selected</option>
                {this.getAnnotatorsOptions()}
              </select>
            </div>
          )}
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-sm-16">{this.getScreenshots()}</div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    //this.interval = setInterval(this.updateMeasurements, 20000);
  }

  componentWillUnmount() {
    //clearInterval(this.interval);
  }

  handlePageClick = page => {
    this.updateMeasurements(page.selected);
  };

  getAnnotatorsOptions = () => {
    if (this.annotators) {
      return this.annotators.map((annotator, index) => {
        return (
          <option key={index} value={annotator}>
            {annotator}
          </option>
        );
      });
    }
  };

  annoratorSelected = evt => {
    const goToPageNumber = this.state.pageNumber;
    const annotator = evt.target.value;
    this.updateMeasurements(goToPageNumber, annotator);
  };

  updateMeasurements = async (goToPageNumber, annotator) => {
    const { pageNumber, screenshotPerPage } = this.state;
    let totalMeasurements = this.state.totalMeasurements;
    goToPageNumber = goToPageNumber || pageNumber;
    const skip = goToPageNumber * screenshotPerPage;

    const measurements = await getMeasurements(this.measurementsDB, {
      annotator: annotator,
      limit: screenshotPerPage,
      skip
    });

    if (totalMeasurements === 0 || annotator) {
      totalMeasurements = await getTotalMeasurements(
        this.measurementsDB,
        annotator
      );
    }

    debugger;
    this.setState({
      totalMeasurements,
      measurements,
      pageNumber,
      annotator
    });
  };

  getScreenshots = () => {
    return this.state.measurements.map(measurement => {
      const host = 'https://db.crowds-cure.org';
      const db = 'measurements';
      const imgName = 'screenshot.jpeg';
      const src = `${host}/${db}/${measurement._id}/${imgName}`;

      const date = new Date(measurement.date * 1000).toUTCString();
      const feedback = measurement.feedback || [];
      const feedbackLabels = feedback.map(f => {
        const option = options.find(opt => opt.value === f);
        if (!option) {
          return `unknown feedback option: ${f}`;
        }

        return option.label;
      });

      const feedbackString = feedbackLabels.join(', ');

      return (
        <div className="row" key={measurement._id}>
          <div className="col-sm-16 col-md-4">
            <h4>{measurement.annotator}</h4>
            <h5>{date}</h5>
            <p>{measurement.caseData.Collection}</p>
            <p>{measurement.caseData.SubjectID}</p>
            <p>{measurement.caseData.studies[0].StudyDescription}</p>
            <p>{measurement.caseData.studies[0].series[0].SeriesDescription}</p>
            <p>
              <strong>Feedback:</strong>
              {feedbackString}
            </p>
          </div>
          <div className="col-sm-16 col-md-12">
            <SecuredImage
              src={src}
              alt={measurement._id}
              onError={() => (this.img.style.display = 'none')}
              getAuthorizationHeader={getAuthorizationHeader}
            />
          </div>
        </div>
      );
    });
  };
}

export default ScreenshotQA;
