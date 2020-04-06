import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlpQgm9rWMA38jsW5kvXCic2GW7i2HCr0",
  authDomain: "apv-app-rn.firebaseapp.com",
  databaseURL: "https://apv-app-rn.firebaseio.com",
  projectId: "apv-app-rn",
  storageBucket: "apv-app-rn.appspot.com",
  messagingSenderId: "446356113991",
  appId: "1:446356113991:web:fbfe1982c811d39ed7ff62",
};
firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;














//TO DO Crear variables de entorno (dotenv)

// import {
//   API_KEY,
//   AUTH_DOMAIN,
//   DATABASE_URL,
//   PROJECT_ID,
//   STORAGE_BUCKET,
//   MESSAGING_SENDER_ID,
//   APP_ID,
// } from "react-native-dotenv";