import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Importera Firebase-moduler för att initiera appen och dess tjänster
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Firebase-konfiguration med projektets uppgifter
const firebaseConfig = {
  apiKey: "AIzaSyAI11NgsxnHixvzuHhuTxt2qfZjszbMHME",
  authDomain: "react2-chatt.firebaseapp.com",
  databaseURL: "https://react2-chatt-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "react2-chatt",
  storageBucket: "react2-chatt.appspot.com",
  messagingSenderId: "652357184019",
  appId: "1:652357184019:web:cca46085fd42aca8e7ade6"
};

// Initiera Firebase-appen med konfigurationen
const app = initializeApp(firebaseConfig);

// Initiera Firestore-tjänster
const analytics = getAnalytics(app);

// Now render your App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
