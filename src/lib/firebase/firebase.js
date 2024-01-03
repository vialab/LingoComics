// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDy68IZz9QgKcG3Lzp0MvEsdwTWYGv1w7U",
    authDomain: "lingocomics-a9625.firebaseapp.com",
    projectId: "lingocomics-a9625",
    storageBucket: "lingocomics-a9625.appspot.com",
    messagingSenderId: "227119794506",
    appId: "1:227119794506:web:3f04f4b1035a462df299b3",
    measurementId: "G-KT5S0PDY4H"
};

// Initialize Firebase
let firebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp();
    deleteApp(firebaseApp);
    firebaseApp = initializeApp(firebaseConfig);
}

export const db = getFirestore(firebaseApp);