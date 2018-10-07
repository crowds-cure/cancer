import { Component } from 'react';
import React from 'react';
import CaseTypeCard from './CaseTypeCard.js';
import './CaseTypeSection.css';

class CaseTypeSection extends Component {
  render() {
    const numbers = [
      {
        name: 'Lung',
        description: 'Measure the largest lesion'
      },
      {
        name: 'Liver',
        description: 'Measure the largest lesion'
      },
      {
        name: 'Brain',
        description: 'Measure the largest lesion'
      },
      {
        name: 'Axillary',
        description: 'Measure the largest lesion'
      }
    ];

    const items = numbers.map(item => (
      <CaseTypeCard
        key={item.name}
        name={item.name}
        description={item.description}
        img={item.img}
      />
    ));

    return <div className="CaseTypeSection">{items}</div>;
  }
}

export default CaseTypeSection;
