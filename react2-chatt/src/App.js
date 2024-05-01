import React, { useRef, useState, useEffect } from 'react';
import './App.css';




import { getFirestore, collection, query, orderBy, limit, serverTimestamp, addDoc } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';





// Firebase-hooks för autentisering och firestore-databasen
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
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
const app = initializeApp(firebaseConfig);





// Initiera Firestore-tjänster
const db = getFirestore();
const auth = getAuth();
const analytics = firebase.analytics();



// App-komponenten som hanterar huvuddelen av vår chattapplikation
function App() {
  // Använder useAuthState-hook för att hålla koll på användarens inloggningstillstånd
  const [user] = useAuthState(auth);


  // Rendera appen med en header och en sektion som visar antingen chatt-rummet eller inloggningsknappen
  return (
    <div className="App">
      <header>
        <h1>...</h1>
        <SignOut />
      </header>


      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}


// SignIn-komponenten som innehåller en knapp för att logga in med Google
function SignIn() {
  // Funktion för att logga in användaren med GooglePopup
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }


  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Logga in med Google</button>
      <p>Bryt inte mot communityns riktlinjer</p>
    </>
  );
}


// SignOut-komponenten som visar en utloggningsknapp när användaren är inloggad
function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Logga Ut</button>
  );
}


// ChatRoom-komponenten hanterar chattgränssnittet och meddelanden
function ChatRoom() {
  const dummy = useRef();
  const messageInput = useRef();
  const messagesRef = collection(db, 'messages');
  // Skapar en fråga för att hämta meddelanden från Firestore, sorterade och begränsade
  const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(25));


  // Använder useCollectionData för att lyssna på meddelanden i realtid
  const [messages] = useCollectionData(q);


  // Statlig variabel för formens värde
  const [formValue, setFormValue] = useState('');


  // Funktion för att skicka meddelanden och lägga till dem i Firestore-databasen
  const sendMessage = async (e) => {
    e.preventDefault();


    const { uid } = auth.currentUser;


    await addDoc(messagesRef, {
      uid,
      text: formValue,
      createdAt: serverTimestamp()
    });


    messageInput.current.focus();
    setFormValue('');
  };


  // Använder useEffect för att skrolla till senaste meddelandet när messages uppdateras
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // Formuläret och meddelandelistan som renderas
  return (
    <>
      <main>
        {messages && messages.slice(0).reverse().map((msg, idx) => <ChatMessage key={idx} message={msg} />)}
        <div ref={dummy} />
      </main>


      <form onSubmit={sendMessage}>
        <input ref={messageInput} value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="säg något snällt" />
        <button type="submit" disabled={!formValue}>Skicka</button>
      </form>
    </>
  );
}


// ChatMessage-komponenten representerar ett enskilt meddelande i chatten
function ChatMessage(props) {
  const { text, uid } = props.message;


  // Bestämmer klassen på meddelandet baserat på om det är skickat eller mottaget
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';


  return (
    <>
      <div className={`message ${messageClass}`}>
        <p>{text}</p>
      </div>
    </>
  );
}


// Exportera App-komponenten som standard
export default App;



