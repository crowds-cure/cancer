import { Component } from 'react';
import React from 'react';
import './StatisticsCard.css';
import PropTypes from 'prop-types';
import animate from './animate';

class StatisticsCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      number: props.number || 0
    };

    this.numberRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.props.number === prevProps.number) {
      return;
    }

    const element = this.numberRef.current;
    const oldValue = this.state.number || 0;
    animate(3000, progress => {
      const diff = this.props.number - oldValue;
      const result = oldValue + diff * progress;
      const newValue = Math.floor(result);
      const currentValue = parseInt(element.innerText, 10);

      if (currentValue === this.props.number) {
        this.setState({ number: this.props.number });
      } else if (newValue !== currentValue) {
        element.innerText = newValue.toLocaleString();
      }
    });
  }

  render() {
    const number = this.state.number.toLocaleString();

    // Replace all numeric chars with the wider number in font (6)
    const formattedNumber = (this.props.number || 0).toLocaleString();
    const fixedNumber = formattedNumber.replace(/[0-9]/g, '6');

    return (
      <div className="StatisticsCard">
        <div className="lineGroup">
          <div className="icon noselect">
            <img src={this.props.icon} alt={number} />
          </div>
          <div className="number">
            <span className="maxWidth noselect">{fixedNumber}</span>
            <span className="visible" ref={this.numberRef}>
              {number}
            </span>
          </div>
        </div>
        <span className="description">{this.props.description}</span>
      </div>
    );
  }
}

StatisticsCard.propTypes = {
  number: PropTypes.number,
  description: PropTypes.object.isRequired
};

export default StatisticsCard;
