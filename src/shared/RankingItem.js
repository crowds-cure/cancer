import { Component } from 'react';
import React from 'react';

const style = {
  height: '100%',
  display: 'flex',
  alignItems: 'left',
  justifyContent: 'left',
  textAlign: 'center',
  color: 'white',
  background: 'black',
  border: 'none',
  overflow: 'hidden'
};

class RankingItem extends Component {
  render() {
    return (
      <div style={style} className="RankingItem">
        <h1>{this.props.number}</h1>
        <h2>{this.props.name}</h2>
      </div>
    );
  }
}

export default RankingItem;
