import { EventEmitter } from 'events';

export const Types = Object.freeze({
  POPUP: 'popup',
  BOX: 'box'
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
    type = Types.POPUP,
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
      onClick
    };

    this.notifications.unshift(notification);

    this.emit(Events.CREATED, notification);
    this.emit(Events.UPDATED, this.notifications);

    return notification;
  }

  popup(title, message, icon, timeout, onClick) {
    return this.create({
      type: Types.POPUP,
      title,
      message,
      icon,
      timeout,
      onClick
    });
  }

  box(title, message, icon, timeout, onClick) {
    const filter = notification => notification.type === Types.BOX;
    const existingBox = this.notifications.find(filter);
    if (existingBox) {
      this.remove(existingBox.id);
    }

    return this.create({
      type: Types.BOX,
      title,
      message,
      icon,
      timeout,
      onClick
    });
  }

  remove(id) {
    const filter = notification => notification.id === id;
    const notification = this.notifications.find(filter);

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
