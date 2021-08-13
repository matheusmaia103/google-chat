import './App.css';
import { useState, useRef } from 'react'

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
    apiKey: "AIzaSyAUKMXlPUHHPqHt8jL20ZwAUdXR_Gs2AVg",
    authDomain: "chat-513b5.firebaseapp.com",
    projectId: "chat-513b5",
    storageBucket: "chat-513b5.appspot.com",
    messagingSenderId: "86588361091",
    appId: "1:86588361091:web:0ec07388a5a0f28c454eb6",
    measurementId: "G-WDG9F5QCJV"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function SignIn (){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
    
  }

  const signInWithFacebook = () =>{
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider);
    alert('login feito')
  }

  return(
    <div class="btns">
      <button
      onClick = {signInWithGoogle}>
      Sign in with Google      
      </button>


      <button
      onClick = {signInWithFacebook}>
        Sign in with Facebook
      </button>
    </div>
  )
}

function UserOut() {

  return auth.currentUser && (
    <button
    onClick = {() => auth.signOut()}
    >
      Sign Out
    </button>
  )
}

function ChatRoom() {

  const lastMsg = useRef()
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  async function sendMessage (e) {
    e.preventDefault();
      
      const { uid, photoURL } = auth.currentUser;

      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })

      setFormValue('');

      lastMsg.current.scrollIntoView({ behavior: 'smooth'})
  }

  return (
    <>
    <UserOut/>
    <main>
      {messages && messages.map(msg => (
        <ChatMessage 
        key = { msg.id }
        message = { msg }
        />
      ))}

      <div ref={lastMsg}></div>
    </main>

    <form
    onSubmit = {sendMessage} >
        <input 
        type="text"
        value = {formValue}
        onChange = {e => setFormValue(e.target.value)}
         />

         <button
         type = 'submit'
         >
           Enivar
         </button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, photoURL, uid} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'
  return (
    <div
    class={`message ${messageClass}`}
    >
      <img src={photoURL} alt="remetent"/>
      <p>{text}</p>
    </div>
  )
}

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      
    <section>
      {user ? <ChatRoom /> : <SignIn />}
    </section>

    </div>
  );
}

export default App;
