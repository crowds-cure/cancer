const defaultState = {
  start: null,
  casesInCurrentSession: 0
};

const session = (state = defaultState, action) => {
  switch (action.type) {
    case 'INCREMENT_NUM_CASES_IN_SESSION':
      return Object.assign({}, state, {
        casesInCurrentSession: state.casesInCurrentSession + 1
      });
    case 'SET_SESSION_START_DATE':
      return Object.assign({}, state, {
        start: action.start
      });
    default:
      return state;
  }
};

export default session;
