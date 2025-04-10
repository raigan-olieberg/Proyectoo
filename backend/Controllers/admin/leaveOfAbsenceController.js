import firebase from '../../firebase.js';
import {
  getFirestore,
  query as firestoreQuery,
} from 'firebase/firestore';


const db = getFirestore(firebase);