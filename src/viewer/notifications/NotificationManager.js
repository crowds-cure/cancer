import { EventEmitter } from 'events';

export const Types = Object.freeze({
  INFO: 'info',
  PROGRESS: 'progress'
});

export const Events = Object.freeze({
  CREATED: 'created',
  REMOVED: 'removed',
  UPDATED: 'updated'
});

class NotificationManager extends EventEmitter {
  constructor() {
    super();

    this.currentId = 0;
    this.notifications = [];
  }

  create({
    title,
    message,
    icon,
    type = Types.INFO,
    timeout = 5000,
    onClick = () => {}
  }) {
    const id = this.currentId++;
    const notification = {
      id,
      title,
      message,
      icon,
      type,
      timeout,
      onclick
    };

    this.notifications.unshift(notification);

    this.emit(Events.CREATED, notification);
    this.emit(Events.UPDATED, this.notifications);

    return notification;
  }

  info(title, message, timeout, onClick) {
    return this.create({
      title,
      message,
      timeout,
      onClick
    });
  }

  progress(title, message, icon, timeout, onClick) {
    return this.create({
      title,
      message,
      icon,
      timeout,
      onClick
    });
  }

  remove(id) {
    const filter = notification => notification.id === id;
    const notification = this.notifications.filter(filter);

    if (notification) {
      const index = this.notifications.indexOf(notification);

      this.notifications.splice(index, 1);

      this.emit(Events.REMOVED, notification);
      this.emit(Events.UPDATED, this.notifications);
    }

    return notification;
  }
}

export default new NotificationManager();
