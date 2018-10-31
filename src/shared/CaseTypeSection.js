import { Component } from 'react';
import React from 'react';
import CaseTypeCard from './CaseTypeCard.js';
import './CaseTypeSection.css';
import { withRouter } from 'react-router-dom';
import { getDB } from '../db';
import PropTypes from 'prop-types';

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
        <div className="CaseTypeSection row">
          {isLoading ? 'Loading...' : items}
        </div>
      </>
    );
  }

  onClick(name) {
    this.context.store.dispatch({
      type: 'SET_SELECTED_COLLECTION',
      collection: name
    });

    this.context.store.dispatch({
      type: 'SET_SESSION_START_DATE',
      start: Date.now()
    });

    this.props.history.push('/viewer');
  }
}

CaseTypeSection.contextTypes = {
  store: PropTypes.object.isRequired
};

export default withRouter(CaseTypeSection);
