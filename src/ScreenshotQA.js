import { Component } from 'react';
import React from 'react';
import SimpleHeaderSection from './shared/SimpleHeaderSection';
import { getDB } from './db.js';

async function getLatestMeasurements() {
  const measurementsDB = getDB('measurements');

  const result = await measurementsDB.find({
    selector: {
      skip: false
    },
    fields: ['_id', 'date', 'annotator', 'caseData'],
    sort: [{ date: 'desc' }],
    limit: 10
  });

  return result.docs;
}

class ScreenshotQA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      measurements: []
    };

    this.updateMeasurements = this.updateMeasurements.bind(this);

    this.updateMeasurements();
  }

  componentDidMount() {
    this.interval = setInterval(this.updateMeasurements, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateMeasurements() {
    getLatestMeasurements().then(measurements => {
      this.setState({
        measurements
      });
    });
  }

  render() {
    const screenshots = this.state.measurements.map(measurement => {
      const host = 'https://db.crowds-cure.org';
      const db = 'measurements';
      const imgName = 'screenshot.jpeg';
      const src = `${host}/${db}/${measurement._id}/${imgName}`;

      const date = new Date(measurement.date * 1000).toUTCString();

      return (
        <div className="row" key={measurement._id}>
          <div className="col-4">
            <h4>{measurement.annotator}</h4>
            <h5>{date}</h5>
            <p>{measurement.caseData.Collection}</p>
            <p>{measurement.caseData.SubjectID}</p>
            <p>{measurement.caseData.studies[0].StudyDescription}</p>
            <p>{measurement.caseData.studies[0].series[0].SeriesDescription}</p>
          </div>
          <div className="col-10">
            <img src={src} alt={measurement._id} />
          </div>
        </div>
      );
    });

    return (
      <div className="ScreenshotQA">
        <SimpleHeaderSection />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10">{screenshots}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScreenshotQA;
