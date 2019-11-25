import React from 'react';
import PropTypes from 'prop-types';

import './NotificationToast.css';

class NotificationToast extends React.Component {
  static propTypes = {
    title: PropTypes.node,
    message: PropTypes.node,
    icon: PropTypes.node
  };

  static defaultProps = {
    title: null,
    message: null,
    icon: null
  };

  render() {
    const { title, message, icon } = this.props;
    return (
      <>
        <div className="icon">
          {icon ? (
            <img src={icon} alt={title} />
          ) : (
            <div className="default">?</div>
          )}
        </div>
        <div className="notificationText" role="alert">
          {title ? <h4 className="title">{title}</h4> : ''}
          {message ? <div className="message">{message}</div> : ''}
        </div>
      </>
    );
  }
}

export default NotificationToast;
