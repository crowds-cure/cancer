import React from 'react';
import NotificationManager from './NotificationManager';
import { Events as NotificationEvents } from './NotificationManager';
import Notification from './Notification';

import './NotificationContainer.css';

class NotificationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleNotificationsUpdate = this.handleNotificationsUpdate.bind(this);
  }

  state = {
    notifications: []
  };

  componentWillMount = () => {
    const event = NotificationEvents.UPDATED;
    NotificationManager.addListener(event, this.handleNotificationsUpdate);
  };

  componentWillUnmount = () => {
    const event = NotificationEvents.UPDATED;
    NotificationManager.removeListener(event, this.handleNotificationsUpdate);
  };

  handleNotificationsUpdate(notifications) {
    this.setState({ notifications });
  }

  handleRequestHide = notification => {
    NotificationManager.remove(notification);
  };

  getNotificationElements(state) {
    const notificationElements = [];

    this.state.notifications.forEach(notification => {
      const onRequestHide = () => this.handleRequestHide(notification);
      notificationElements.push(
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          icon={notification.icon}
          timeout={notification.timeout}
          onClick={notification.onClick}
          onRequestHide={onRequestHide}
        />
      );
    });

    return notificationElements;
  }

  render() {
    return (
      <div className="NotificationContainer">
        {this.getNotificationElements(this.state)}
      </div>
    );
  }
}

export default NotificationContainer;
