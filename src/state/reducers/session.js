const session = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT_NUM_CASES_IN_SESSION':
      return state + 1;
    default:
      return state;
  }
};

export default session;
