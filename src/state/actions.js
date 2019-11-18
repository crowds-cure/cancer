export const setToolActive = tool => ({
  type: 'SET_ACTIVE',
  tool
});

export const incrementNumMeasurementsInSession = num => ({
  type: 'INCREMENT_NUM_MEASUREMENTS_IN_SESSION',
  num
});

export const resetSession = () => ({
  type: 'RESET_SESSION'
});

export const setTotalCompleteCollection = num => ({
  type: 'TOTAL_COMPLETE_COLLECTION',
  num
});

export const fetchCaseRequest = () => ({
  type: 'FETCH_CASE_REQUEST'
});

export const fetchCaseFailure = error => ({
  type: 'FETCH_CASE_FAILURE',
  error
});

export const fetchCaseSuccess = response => ({
  type: 'FETCH_CASE_SUCCESS',
  response
});
