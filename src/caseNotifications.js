const caseNotifications = {
  noMeasurements: {
    min: 0,
    alertDiff: 0,
    alertMessage: 'Measure lesions to get points'
  },
  firstMeasurement: {
    min: 1,
    alertDiff: 0,
    alertMessage: 'Label the lesion to add more value to the data'
  },
  NUM_CASES_ROOKIE: {
    min: 35,
    alertDiff: 0,
    alertTitle: 'You’re on fire!',
    alertMessage: 'Your contribution is greatly appreciated'
  }
};

export { caseNotifications };
