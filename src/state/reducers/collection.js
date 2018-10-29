const defaultState = {
  name: null
};

const collection = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_SELECTED_COLLECTION':
      return Object.assign({}, state, {
        name: action.collection
      });
    default:
      return state;
  }
};

export default collection;
