import { LOAD_PROJECT_SETTINGS } from '../../actionTypes';
import { getProjectSettings } from '../../../utils/firebase';

export const storeProjectSettings = containerId => {
  const promise = getProjectSettings(console.log);
  return {
    type: LOAD_PROJECT_SETTINGS,
    promise,
  };
};
