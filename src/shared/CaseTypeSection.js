import { Component } from 'react';
import React from 'react';
import CaseTypeCard from './CaseTypeCard.js';
import './CaseTypeSection.css';
import { withRouter } from 'react-router-dom';

class CaseTypeSection extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  render() {
    const numbers = [
      {
        id: 'lung',
        name: 'Lung',
        description: 'Measure the largest lesion'
      },
      {
        id: 'liver',
        name: 'Liver',
        description: 'Measure the largest lesion'
      },
      {
        id: 'brain',
        name: 'Brain',
        description: 'Measure the largest lesion'
      },
      {
        id: 'axillary',
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
        click={event => this.onClick(event, item)}
      />
    ));

    return (
      <>
        <h1 className="CaseTypeSectionTitle">Select a case type</h1>
        <div className="CaseTypeSection">{items}</div>
      </>
    );
  }

  onClick(event, item) {
    // TODO: dispatch action to Redux store to set the case type which has been selected
    console.log(event);
    console.log(item);
    this.props.history.push('/viewer');
  }
}

export default withRouter(CaseTypeSection);
