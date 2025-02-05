// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-jJN_Y2xSHP7KfCUMIHgdPZ_IZ1fz3NY",
  authDomain: "lawapp-3ec1d.firebaseapp.com",
  projectId: "lawapp-3ec1d",
  storageBucket: "lawapp-3ec1d.firebasestorage.app",
  messagingSenderId: "296571227322",
  appId: "1:296571227322:web:10e9adadb16a42c3a54683",
  measurementId: "G-3E49YME348"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);