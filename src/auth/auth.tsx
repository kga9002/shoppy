import {
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: "shoppy-fa594.firebaseapp.com",
  databaseURL: "https://shoppy-fa594-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shoppy-fa594",
  storageBucket: "shoppy-fa594.appspot.com",
  messagingSenderId: "498278514030",
  appId: "1:498278514030:web:41cfdc73d471977884157f",
  measurementId: "G-GQL4871BR2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const provider = new GoogleAuthProvider();

export function signIn() {
  return setPersistence(auth, browserSessionPersistence).then(() => {
    signInWithPopup(auth, provider)
      .then(() => {
        window.location.replace("/");
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

export function logOut() {
  return signOut(auth).then(() => {
    window.location.replace("/");
  });
}
