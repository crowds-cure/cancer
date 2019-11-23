import React from 'react';
import PropTypes from 'prop-types';

import './NotificationBox.css';

import halo1 from '../images/general/halo1.svg';
import halo2 from '../images/general/halo2.svg';
import halo3 from '../images/general/halo3.svg';

class NotificationBox extends React.Component {
  static propTypes = {
    title: PropTypes.node,
    message: PropTypes.node,
    icon: PropTypes.node
  };

  static defaultProps = {
    title: null,
    message: PropTypes.node,
    icon: null
  };

  render() {
    const { title, message, icon } = this.props;
    return (
      <div className="background">
        <div className="icon">
          <img src={icon} alt={title} />
          <div className="halo halo1">
            <img src={halo1} alt={title} />
          </div>
          <div className="halo halo2">
            <img src={halo2} alt={title} />
          </div>
          <div className="halo halo3">
            <img src={halo3} alt={title} />
          </div>
        </div>
        <div className="notificationText" role="alert">
          {message ? <div className="message">{message}</div> : ''}
          {title ? <h4 className="title">{title}</h4> : ''}
        </div>
      </div>
    );
  }
}

export default NotificationBox;
