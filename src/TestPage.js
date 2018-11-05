import { Component } from 'react';
import React from 'react';
import './TestPage.css';

import Labelling from './labelling/labelling.js';

class TestPage extends Component {
  render() {
    return (
      <div className="TestPage">
        <Labelling />
      </div>
    );
  }
}

export default TestPage;
