import { Component } from 'react';
import React from 'react';
import CaseTypeCard from './CaseTypeCard.js';
import './CaseTypeSection.css';
import { withRouter } from 'react-router-dom';
import { getDB } from '../db';

class CaseTypeSection extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);

    this.state = {
      types: [],
      isLoading: true
    };

    const collectionsDB = getDB('collections');

    collectionsDB.allDocs({ include_docs: true }).then(docs => {
      const types = docs.rows.map(row => row.doc);

      this.setState({
        types,
        isLoading: false
      });
    });
  }

  render() {
    const { isLoading, types } = this.state;

    const items = types.map(item => (
      <CaseTypeCard
        key={item.Collection}
        name={item.Collection}
        type={item.Type}
        link={item.Link}
        description={item.Description}
        img={item.img}
        click={event => this.onClick(event, item)}
      />
    ));

    return (
      <>
        <h1 className="CaseTypeSectionTitle">Select a case type</h1>
        <div className="CaseTypeSection">
          {isLoading ? 'Loading...' : items}
        </div>
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
