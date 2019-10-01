import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Types as NotificationTypes } from './NotificationManager';
import NotificationPopup from './NotificationPopup';
import NotificationBox from './NotificationBox';

class Notification extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf([NotificationTypes.POPUP, NotificationTypes.BOX]),
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
    const animationCallback = () => {
      element.removeEventListener('animationend', animationCallback);
      element.classList.remove('fadingOut');

      const { onRequestHide } = this.props;
      if (onRequestHide) {
        onRequestHide();
      }
    };

    element.addEventListener('animationend', animationCallback);
    element.classList.add('fadingOut');
  };

  renderNotificationByType(props) {
    const { type, title, message, icon } = props;

    if (type === NotificationTypes.BOX) {
      return <NotificationBox title={title} message={message} icon={icon} />;
    }

    return <NotificationPopup title={title} message={message} icon={icon} />;
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
