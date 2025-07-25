import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "finsight-try-auth",
  appId: "1:567554023265:web:79ea7aeed50ceb6693ef20",
  storageBucket: "finsight-try-auth.firebasestorage.app",
  apiKey: "AIzaSyCYtbevsbB-id2gHBNsr7x-V_DPL9MpXtg",
  authDomain: "finsight-try-auth.firebaseapp.com",
  messagingSenderId: "567554023265"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
