import notificationOnFire from './images/general/notification-on-fire.svg';

const caseNotifications = {
  noMeasurements: {
    min: 0,
    alertMessage: 'Measure lesions to get points'
  },
  firstMeasurement: {
    min: 1,
    alertMessage: 'Label the lesion to add more value to the data'
  },
  NUM_CASES_ROOKIE: {
    img: notificationOnFire,
    min: 35,
    alertTitle: 'You’re on fire!',
    alertMessage: 'Your contribution is greatly appreciated'
  }
};

export { caseNotifications };
