const defaultState = {
  isFetching: true,
  caseData: { data: {}, seriesData: [] },
  error: null
};

const cases = (state = defaultState, action) => {
  switch (action.type) {
    case 'FETCH_CASE_REQUEST':
      return Object.assign({}, state, {
        isFetching: true
      });
    case 'FETCH_CASE_FAILURE':
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    case 'FETCH_CASE_SUCCESS':
      return Object.assign({}, state, {
        isFetching: false,
        caseData: action.response
      });
    default:
      return state;
  }
};

export default cases;
