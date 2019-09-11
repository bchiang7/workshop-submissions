import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyDZhqSzyworQztMxvFgy4eoiXu-aSDcwss',
  authDomain: 'intro-to-webdev-workshop.firebaseapp.com',
  projectId: 'intro-to-webdev-workshop',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.firestore();

export default db;
