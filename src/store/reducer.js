import { combineReducers } from 'redux';
import user from './user/reducer';
import container from './container/reducer';
import containers from './containers/reducer';
import project from './project/reducer';

const rootReducer = combineReducers({
  container,
  containers,
  project,
  user,
});

export default rootReducer;
