import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAPOnHDERLEr_fKC67cZZqUp19fLyK7F7U",
  authDomain: "book-review-d9188.firebaseapp.com",
  projectId: "book-review-d9188",
  storageBucket: "book-review-d9188.appspot.com",
  messagingSenderId: "368884658316",
  appId: "1:368884658316:web:b2f21bd1c13ddebd12cba9",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const subscriptions = [];
