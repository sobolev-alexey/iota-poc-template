import { combineReducers } from 'redux';
import { LOGOUT } from './actionTypes';
import user from './user/reducer';
import item from './item/reducer';
import items from './items/reducer';
import project from './project/reducer';

const appReducer = combineReducers({
  item,
  items,
  project,
  user,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
