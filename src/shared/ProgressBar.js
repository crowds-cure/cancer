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
  border: '1px solid cyan',
  overflow: 'hidden'
};

class ProgressBar extends Component {
  render() {
    return <div style={style} className="ProgressBar" />;
  }
}

export default ProgressBar;
