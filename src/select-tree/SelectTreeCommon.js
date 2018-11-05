import { Component } from 'react';
import React from 'react';
import 'SelectTreeCommon.css';

class selectTreeCommon extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  render() {
    const items = numbers.map(item => (
      <label
        onClick={event => this.onClick(event, item)}
        htmlFor="{this.storageKey}_{encodeId item.value}"
      >
        {item.label}
      </label>
    ));

    return (
      <div className="select-tree-common">
        <div className="content">
          <h5 className="title">Common</h5>
          <div className="labels">{items}</div>
        </div>
      </div>
    );
  }

  onClick(event, item) {
    console.log('clicked');
    this.props.click(event, item);
  }
}

export default selectTreeCommon;
