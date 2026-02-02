import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBE_PkLrJxYnU49inGreiOuDlfqYwwdhx4",
  authDomain: "khmer-lyrics.firebaseapp.com",
  projectId: "khmer-lyrics",
  storageBucket: "khmer-lyrics.firebasestorage.app",
  messagingSenderId: "199621657942",
  appId: "1:199621657942:web:7fa7c28be362d99f7b42f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
