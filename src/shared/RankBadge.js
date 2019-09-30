import { Component } from 'react';
import React from 'react';

import './RankBadge.css';

class RankBadge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      img: this.props.img
    };

    this.imgRef = React.createRef();
  }

  componentDidUpdate() {
    const oldImg = this.state.img;
    const newImg = this.props.img;

    if (newImg !== oldImg) {
      const imgElement = this.imgRef.current;
      const rankFadeInCallback = () => {
        imgElement.classList.remove('rankFadeIn');
        imgElement.removeEventListener('animationend', rankFadeInCallback);
      };
      const rankFadeOutCallback = () => {
        imgElement.addEventListener('animationend', rankFadeInCallback);
        imgElement.classList.add('rankFadeIn');
        imgElement.classList.remove('rankFadeOut');
        imgElement.removeEventListener('animationend', rankFadeOutCallback);
        this.setState({ img: newImg });
      };

      imgElement.addEventListener('animationend', rankFadeOutCallback);
      imgElement.classList.add('rankFadeOut');
    }
  }

  render() {
    return (
      <div className="rankBadge noselect" ref={this.imgRef}>
        <img
          src={this.state.img}
          alt={this.props.name}
          data-tip={this.props.description}
          onClick={this.props.onClick}
        />
      </div>
    );
  }
}

export default RankBadge;
