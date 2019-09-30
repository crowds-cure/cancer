import { Component } from 'react';
import React from 'react';

import './RankBadge.css';

class RankBadge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      img: this.props.img
    };

    this.badgeRef = React.createRef();
  }

  componentDidUpdate() {
    const oldImg = this.state.img;
    const newImg = this.props.img;

    if (newImg !== oldImg) {
      const badgeElement = this.badgeRef.current;
      const rankFadeInCallback = () => {
        badgeElement.classList.remove('rankFadeIn');
        badgeElement.removeEventListener('animationend', rankFadeInCallback);
        badgeElement.setAttribute('data-tip-disable', false);
      };
      const rankFadeOutCallback = () => {
        badgeElement.addEventListener('animationend', rankFadeInCallback);
        badgeElement.classList.add('rankFadeIn');
        badgeElement.classList.remove('rankFadeOut');
        badgeElement.removeEventListener('animationend', rankFadeOutCallback);
        this.setState({ img: newImg });
      };

      badgeElement.setAttribute('data-tip-disable', true);
      badgeElement.addEventListener('animationend', rankFadeOutCallback);
      badgeElement.classList.add('rankFadeOut');
    }
  }

  render() {
    return (
      <div
        className="rankBadge noselect"
        data-tip={this.props.description}
        ref={this.badgeRef}
        onClick={this.props.onClick}
      >
        <img src={this.state.img} alt={this.props.name} />
      </div>
    );
  }
}

export default RankBadge;
