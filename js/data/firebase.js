// Firebase v8 Compat Initialization
const firebaseConfig = {
    apiKey: "AIzaSyDjmsH-EUzsstJFYOpeEaLnG-vlexA7sH0",
    authDomain: "marwa-libas-web.firebaseapp.com",
    projectId: "marwa-libas-web",
    storageBucket: "marwa-libas-web.firebasestorage.app",
    messagingSenderId: "266079387477",
    appId: "1:266079387477:web:dc51876fc472e90b5179dc",
    measurementId: "G-QVE4M8HLP9"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
