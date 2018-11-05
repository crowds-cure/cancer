const defaultState = {
  current: undefined
};

const user = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_FROM_DATABASE':
      return Object.assign({}, state, action.savedState);
    default:
      return state;
  }
};

export default user;
