// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import "firebase/compat/storage"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpPtQDPWl9L4ZLJu0I1vedIukzxAlmZTc",
  authDomain: "mrs-quiz-b84d3.firebaseapp.com",
  projectId: "mrs-quiz-b84d3",
  storageBucket: "mrs-quiz-b84d3.appspot.com",
  messagingSenderId: "1083450108255",
  appId: "1:1083450108255:web:964b318f6fcfb76e8e2eea",
  measurementId: "G-9TV3H6YP07"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase
