import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Types as NotificationTypes } from './NotificationManager';
import NotificationToast from './NotificationToast';
import NotificationBox from './NotificationBox';
import waitForAnimation from '../shared/waitForAnimation';

class Notification extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf([NotificationTypes.TOAST, NotificationTypes.BOX]),
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
    icon: null,
    timeout: 5000,
    onClick: () => {},
    onRequestHide: () => {}
  };

  constructor(props) {
    super(props);

    this.notificationRef = React.createRef();
  }

  componentDidMount = () => {
    const { timeout } = this.props;
    if (timeout > 0) {
      this.timer = setTimeout(this.requestHide, timeout);
    }

    const element = this.notificationRef.current;
    this.fadeInPromise = waitForAnimation(element, 'fadingIn');
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
    const element = this.notificationRef.current;
    const fadeInPromise = this.fadeInPromise || Promise.resolve();
    const fadeOutPromise = new Promise(resolve => {
      fadeInPromise.then(() =>
        setTimeout(() => {
          waitForAnimation(element, 'fadingOut').then(resolve);
        })
      );
    });

    fadeOutPromise.then(() => {
      const { onRequestHide } = this.props;
      if (onRequestHide) {
        onRequestHide();
      }
    });
  };

  renderNotificationByType(props) {
    const { type, title, message, icon } = props;

    if (type === NotificationTypes.BOX) {
      return <NotificationBox title={title} message={message} icon={icon} />;
    }

    return <NotificationToast title={title} message={message} icon={icon} />;
  }

  render() {
    const { type } = this.props;
    const className = classnames(['Notification', `notification-${type}`]);
    return (
      <div
        className={className}
        onClick={this.handleClick}
        ref={this.notificationRef}
      >
        {this.renderNotificationByType(this.props)}
      </div>
    );
  }
}

export default Notification;
