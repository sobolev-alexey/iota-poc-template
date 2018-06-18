import { handle } from 'redux-pack';
import { isEmpty } from 'lodash';
import { LOAD_PROJECT_SETTINGS } from '../../actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_PROJECT_SETTINGS:
      if (isEmpty(payload)) return state;
      return handle(state, action, {
        success: prevState => {
          return {
            ...payload,
          };
        },
        failure: prevState => {
          return {
            data: prevState,
          };
        },
      });
    default:
      return state;
  }
};
