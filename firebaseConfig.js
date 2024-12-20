// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import {getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq2-gh1iRFZDuy03jeZzlij-BGyfaV9Cg",
  authDomain: "llamachatbot-9f74f.firebaseapp.com",
  projectId: "llamachatbot-9f74f",
  storageBucket: "llamachatbot-9f74f.firebasestorage.app",
  messagingSenderId: "391836501646",
  appId: "1:391836501646:web:5d4460347f90d979e22bdf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
export {db,auth}

