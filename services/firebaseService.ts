import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { APP_ID_KEY } from "../constants";
import { AppState } from "../types";

// Using config provided in the source request to ensure functionality
const firebaseConfig = {
  apiKey: "AIzaSyDUN827ZeD2YhEYAkB5OeWkF6OIiF59bFI",
  authDomain: "learning-eng-cc8e5.firebaseapp.com",
  projectId: "learning-eng-cc8e5",
  storageBucket: "learning-eng-cc8e5.firebasestorage.app",
  messagingSenderId: "443233964962",
  appId: "1:443233964962:web:d7181e4bb4e2377c5898fb",
  measurementId: "G-K60HHNSBQ2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const loginGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Login Error:", error);
    // Don't throw, just let the UI handle the idle state
  }
};

export const logoutGoogle = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.error("Logout error", e);
  }
};

export const saveCloudData = async (uid: string, data: AppState) => {
  try {
    await setDoc(doc(db, 'artifacts', APP_ID_KEY, 'users', uid, 'data', 'profile'), data);
    return true;
  } catch (e) {
    // Silent fail for offline/permission issues
    return false;
  }
};

export const loadCloudData = async (uid: string): Promise<AppState | null> => {
  try {
    const docRef = doc(db, 'artifacts', APP_ID_KEY, 'users', uid, 'data', 'profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as AppState;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const initAuthListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      // Attempt anonymous login. If it fails (e.g. domain restriction), 
      // catch the error and fallback to null user (offline mode).
      signInAnonymously(auth)
        .then(() => {
          // This will trigger onAuthStateChanged again with the new user
        })
        .catch((err) => {
          // Suppress errors to prevent console noise in restricted environments
          console.log("Running in offline mode (Auth skipped)");
          callback(null);
        });
    }
  });
};