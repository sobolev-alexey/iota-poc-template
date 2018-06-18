import { ADD_CONTAINER, STORE_CONTAINERS } from '../../actionTypes';
import { getFirebaseSnapshot, getItemsReference } from '../../../utils/firebase';

export const addContainer = containerId => {
  const promise = getFirebaseSnapshot(containerId, console.log);
  return {
    type: ADD_CONTAINER,
    promise,
  };
};

export const storeContainers = user => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const results = [];
      const promises = [];
      const ref = getItemsReference();

      switch (user.role) {
        case 'shipper':
          const queryByShipper = ref.orderByChild('owner').equalTo(user.id);
          promises.push(queryByShipper.once('value'));
          break;
        case 'observer':
          promises.push(ref.once('value'));
          break;
        default:
          const queryByStatus = ref.orderByChild('status');
          user.previousEvent.forEach(status => {
            const query = queryByStatus.equalTo(status);
            promises.push(query.once('value'));
          });
          break;
      }

      await Promise.all(promises)
        .then(snapshots => {
          snapshots.forEach(snapshot => {
            const val = snapshot.val();
            if (val) {
              results.push(...Object.values(val));
            }
          });
        })
        .catch(error => {
          return reject({ error: 'Loading containers failed' });
        });

      if (results.length > 0) {
        return resolve({ data: results, error: null });
      } else {
        return reject({ error: 'No containers found' });
      }
    } catch (error) {
      return reject({ error: 'Loading containers failed' });
    }
  });

  return {
    type: STORE_CONTAINERS,
    promise,
  };
};
