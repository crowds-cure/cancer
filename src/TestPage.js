import { Component } from 'react';
import React from 'react';
import './TestPage.css';

import Labelling from './labelling/labelling.js';

class TestPage extends Component {
  render() {
    return (
      <div className="TestPage">
        <Labelling
          selectTreeFirstTitle="Add Label"
          selectTreeSecondTitle="Add Description"
          measurementData={{}}
          eventData={{
            currentPoints: {
              canvas: {
                x: 0,
                y: 0
              }
            }
          }}
          labellingDoneCallback={() => alert('Done')}
        />
      </div>
    );
  }
}

export default TestPage;
