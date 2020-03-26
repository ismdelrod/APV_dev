import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBkLsjN1_dQ8TRY6nMJEFLXiqP27cWzfgg",
  authDomain: "rn-apv.firebaseapp.com",
  databaseURL: "https://rn-apv.firebaseio.com",
  projectId: "rn-apv",
  storageBucket: "rn-apv.appspot.com",
  messagingSenderId: "37255937115",
  appId: "1:37255937115:web:ccbbfee142783c47e3d37e",
  measurementId: "G-9EEC6D9733"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
