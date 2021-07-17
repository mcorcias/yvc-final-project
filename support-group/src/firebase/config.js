import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB2RYiWrslNNHHiwYAn1y3BgubFTlLMOEo',
  authDomain: 'yvc-final-project-f2305.firebaseapp.com',
  projectId: 'yvc-final-project-f2305',
  storageBucket: 'yvc-final-project-f2305.appspot.com',
  messagingSenderId: '929121446861',
  appId: '1:929121446861:web:f1340f07a211dff922b284',
};

//init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

// timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectFirestore, projectStorage, projectAuth, timestamp };
