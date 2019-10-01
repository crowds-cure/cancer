import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Types as NotificationTypes } from './NotificationManager';

class Notification extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf([NotificationTypes.INFO, NotificationTypes.PROGRESS]),
    title: PropTypes.node,
    message: PropTypes.node,
    icon: PropTypes.node,
    timeout: PropTypes.number,
    onClick: PropTypes.func,
    onRequestHide: PropTypes.func
  };

  static defaultProps = {
    type: NotificationTypes.INFO,
    title: null,
    message: null,
    timeout: 5000,
    onClick: () => {},
    onRequestHide: () => {}
  };

  componentDidMount = () => {
    const { timeout } = this.props;
    if (timeout > 0) {
      this.timer = setTimeout(this.requestHide, timeout);
    }
  };

  componentWillUnmount = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  };

  handleClick = () => {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }

    this.requestHide();
  };

  requestHide = () => {
    const { onRequestHide } = this.props;
    if (onRequestHide) {
      onRequestHide();
    }
  };

  render() {
    const { type, title, message } = this.props;
    const className = classnames(['Notification', `notification-${type}`]);
    return (
      <div className={className} onClick={this.handleClick}>
        <div className="icon" />
        <div className="notification-text" role="alert">
          {title ? <h4 className="title">{title}</h4> : ''}
          {message ? <div className="message">{message}</div> : ''}
        </div>
      </div>
    );
  }
}

export default Notification;
