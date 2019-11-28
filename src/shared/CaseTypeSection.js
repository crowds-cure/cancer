import { Component } from 'react';
import React from 'react';
import CaseTypeCard from './CaseTypeCard.js';
import './CaseTypeSection.css';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class CaseTypeSection extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    types: PropTypes.array.isRequired
  };

  render() {
    const { isLoading, types } = this.props;

    const placeholderKeys = Array.from(Array(4).keys());
    const placeholderItems = placeholderKeys.map(key => (
      <CaseTypeCard key={key} placeholder={key} />
    ));

    const items = types.map(item => (
      <CaseTypeCard
        key={item.Collection}
        name={item.Collection}
        type={item.Type}
        description={item.Description}
        byAnnotator={item.byAnnotator}
        inCollection={item.inCollection}
        img={item.img}
        click={event => this.onClick(event, item)}
        clickInfo={event => this.props.onClickInfo(event, item)}
      />
    ));

    return (
      <div className="CaseTypeSection row">
        {isLoading ? placeholderItems : items}
      </div>
    );
  }

  onClick = name => {
    this.context.store.dispatch({
      type: 'SET_SELECTED_COLLECTION',
      collection: name
    });

    this.context.store.dispatch({
      type: 'SET_SESSION_START_DATE',
      start: Date.now()
    });

    this.props.history.push('/viewer');
  };
}

export default withRouter(CaseTypeSection);
