const defaultState = {
  casesInCurrentSession: 0
};

const session = (state = defaultState, action) => {
  switch (action.type) {
    case 'INCREMENT_NUM_CASES_IN_SESSION':
      return Object.assign({}, state, {
        casesInCurrentSession: state.casesInCurrentSession + 1
      });
    default:
      return state;
  }
};

export default session;
