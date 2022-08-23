  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import 'firebase/auth';                                                                                                                                                                  
  import 'firebase/storage';
  // import * as firebase from 'firebase/app';

  // <script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js"></script>
  // <script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-storage.js"></script>
 
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDGi3ndUC1b4SFNstliSSVryu7_ymXEkZc",
    authDomain: "match-home-7d1f9.firebaseapp.com",
    projectId: "match-home-7d1f9",
    storageBucket: "match-home-7d1f9.appspot.com",
    messagingSenderId: "747751099607",
    appId: "1:747751099607:web:29d1e5beda87c847dfb492"

    // gs://match-home-7d1f9.appspot.com
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export const db = firebase.firestore();


  


  