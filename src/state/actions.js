export const setToolActive = tool => ({
  type: 'SET_ACTIVE',
  tool
});

export const incrementNumCasesInSession = () => ({
  type: 'INCREMENT_NUM_CASES_IN_SESSION'
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
