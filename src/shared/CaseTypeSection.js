import { Component } from 'react';
import React from 'react';
import CaseTypeCard from './CaseTypeCard.js';
import './CaseTypeSection.css';
import PropTypes from 'prop-types';

class CaseTypeSection extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  render() {
    const { isLoading, types } = this.props;

    const items = types.map(item => (
      <CaseTypeCard
        key={item.Collection}
        name={item.Collection}
        type={item.Type}
        description={item.Description}
        img={item.img}
        click={event => this.onClick(event, item)}
        clickInfo={event => this.props.onClickInfo(event, item)}
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

CaseTypeSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  types: PropTypes.array.isRequired
};

export default CaseTypeSection;
