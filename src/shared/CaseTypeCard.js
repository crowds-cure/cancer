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

class CaseTypeCard extends Component {
  render() {
    return (
      <div style={style} className="CaseTypeCard">
        <h1>{this.props.name}</h1>
        {/*<p>{this.props.description}</p>*/}
        {/*<img src={{this.props.img}}></img>*/}
      </div>
    );
  }
}

export default CaseTypeCard;
