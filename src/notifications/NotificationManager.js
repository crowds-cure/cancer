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
    options={}
  }) {
    const defaultOptions = {
      type: Types.POPUP,
      timeout: 5000,
      onClick: () => {}
    };
    const currentOptions = Object.assign({}, defaultOptions, options);
    const { type, timeout, wait, onClick, onRemove } = currentOptions;

    const id = this.currentId++;
    const notification = {
      id,
      title,
      message,
      icon,
      type,
      timeout: timeout + (wait || 0),
      onClick,
      onRemove
    };

    const notify = () => {
      this.notifications.unshift(notification);

      this.emit(Events.CREATED, notification);
      this.emit(Events.UPDATED, this.notifications);
    }

    if (wait) {
      setTimeout(notify, wait);
    } else {
      notify();
    }

    return notification;
  }

  popup(title, message, icon, options={}) {
    options.type = Types.POPUP;
    return this.create({
      title,
      message,
      icon,
      options
    });
  }

  box(title, message, icon, options={}) {
    const filter = notification => notification.type === Types.BOX;
    const existingBox = this.notifications.find(filter);
    if (existingBox) {
      this.remove(existingBox.id);
    }

    options.type = Types.BOX;
    return this.create({
      title,
      message,
      icon,
      options
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

      if (typeof notification.onRemove === 'function') {
        notification.onRemove();
      }
    }

    return notification;
  }
}

export default new NotificationManager();
