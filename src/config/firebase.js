// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsqFRkGMX_YmX3Zx2k7PNSst7YNi2GnhE",
  authDomain: "my-app-waseem.firebaseapp.com",
  projectId: "my-app-waseem",
  storageBucket: "my-app-waseem.appspot.com",
  messagingSenderId: "763678646542",
  appId: "1:763678646542:web:27b3b5b686838e01eeb75f",
  measurementId: "G-HFCR4CTG8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)
const auth = getAuth(app)
export {analytics,firestore,auth}