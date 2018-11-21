const defaultState = {
  start: null,
  measurementsInCurrentSession: 0,
  totalCompleteCollection: 0
};

const session = (state = defaultState, action) => {
  switch (action.type) {
    case 'INCREMENT_NUM_MEASUREMENTS_IN_SESSION':
      return Object.assign({}, state, {
        measurementsInCurrentSession:
          state.measurementsInCurrentSession + action.num
      });
    case 'TOTAL_COMPLETE_COLLECTION':
      return Object.assign({}, state, {
        totalCompleteCollection: action.num
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
