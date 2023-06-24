import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAq57L8WnisZ_id9jqNJ5anjRiXjWQE_F0",
    authDomain: "klippie-2d73d.firebaseapp.com",
    projectId: "klippie-2d73d",
    storageBucket: "klippie-2d73d.appspot.com",
    messagingSenderId: "770628815984",
    appId: "1:770628815984:web:f1c5023ed1671d7f0938b5",
    measurementId: "G-CHJQZWWL1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth , provider };