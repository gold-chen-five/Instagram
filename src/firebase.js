import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDMJ31LPEEkqLHgOsKcJYMbrfUeqHweeUk",
    authDomain: "instagram-clone-27326.firebaseapp.com",
    projectId: "instagram-clone-27326",
    storageBucket: "instagram-clone-27326.appspot.com",
    messagingSenderId: "426622761965",
    appId: "1:426622761965:web:56f30a8b0f2ef8ebc0c5e4",
    measurementId: "G-Z6HBSSH718"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};