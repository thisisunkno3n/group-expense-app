import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUQ6SFrUyUgrKhtrETiPcYrxLbegswm7E",
  authDomain: "group-expense-app-88294.firebaseapp.com",
  projectId: "group-expense-app-88294",
  storageBucket: "group-expense-app-88294.firebasestorage.app",
  messagingSenderId: "396495080495",
  appId: "1:396495080495:web:a8d3fa37f7d1d8fcd58ada",
  measurementId: "G-XLXV4LFDKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 