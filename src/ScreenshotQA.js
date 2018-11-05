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
    fields: ['_id', 'date', 'annotator'],
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

      return <img src={src} alt={measurement._id} key={measurement._id} />;
    });

    return (
      <div className="ScreenshotQA">
        <SimpleHeaderSection />
        <div className="container">
          <div className="row align-items-center">
            <div className="col title-wrapper">
              <label className="title">ScreenshotQA</label>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-10">{screenshots}</div>
          </div>
          >
        </div>
      </div>
    );
  }
}

export default ScreenshotQA;
