import { combineReducers } from 'redux';
import tools from './tools.js';
import session from './session.js';
import cases from './cases.js';
import user from './user.js';
import collection from './collection.js';

export default combineReducers({
  tools,
  session,
  cases,
  user,
  collection
});
