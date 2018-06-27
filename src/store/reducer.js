import { combineReducers } from 'redux';
import user from './user/reducer';
import item from './item/reducer';
import items from './items/reducer';
import project from './project/reducer';

const rootReducer = combineReducers({
  item,
  items,
  project,
  user,
});

export default rootReducer;
