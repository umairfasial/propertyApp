import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

export function convertFirestoreTimestamps(obj) {
  for (const key in obj) {
    if (obj[key] instanceof firestore.Timestamp) {
      obj[key] = moment(obj[key].toDate()).format('YYYY-MM-DD HH:mm:ss');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      obj[key] = convertFirestoreTimestamps(obj[key]);
    }
  }
  return obj;
}
