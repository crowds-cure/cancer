import { Component } from 'react';
import React from 'react';
import './StatisticsPage.css';
import getCollectionMeasurementStats from './shared/getCollectionMeasurementStats.js';
import LoadingIndicator from './shared/LoadingIndicator';
import SimpleHeaderSection from './shared/SimpleHeaderSection';

class StatisticsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionsByTeam: '',
      teamUsers: '',
      collectionMeasurementStats: ''
    };

    getCollectionMeasurementStats().then(collectionMeasurementStats => {
      this.setState({ collectionMeasurementStats });
    });
  }

  render() {
    let stats;
    if (this.state.collectionMeasurementStats) {
      const {
        measurementCount,
        caseCount,
        averageMeasurements
      } = this.state.collectionMeasurementStats;

      debugger;

      const collectionNames = Object.keys(measurementCount);

      stats = collectionNames.map((name, index) => {
        const numMeasurements =
          measurementCount[name] !== undefined ? measurementCount[name] : 0;
        const numCases = caseCount[name] !== undefined ? caseCount[name] : 0;
        const avgMeasurments =
          averageMeasurements[name] !== undefined
            ? averageMeasurements[name]
            : 0;

        return (
          <div className="col-sm-16" key={index}>
            <h1>{name}</h1>
            <h3>Number of Measurements: {numMeasurements}</h3>
            <h3>Number of Cases: {numCases}</h3>
            <h3>Average Number of Measurements per Case: {avgMeasurments}</h3>
          </div>
        );
      });
    } else {
      stats = <LoadingIndicator />;
    }

    return (
      <div className="StatisticsPage">
        <SimpleHeaderSection />
        <div className="container">
          <div className="row">{stats}</div>
        </div>
      </div>
    );
  }
}

export default StatisticsPage;
