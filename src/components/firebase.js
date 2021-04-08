// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCt4Gsm7tL89Hwxm1heHKViyyvGLIEa9Xc",
  authDomain: "chat-app-bd61d.firebaseapp.com",
  projectId: "chat-app-bd61d",
  storageBucket: "chat-app-bd61d.appspot.com",
  messagingSenderId: "245677453994",
  appId: "1:245677453994:web:ed3fb48ffccfa4350056d3",
  measurementId: "G-7PKLP6S02J",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
