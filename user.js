// Firebase configuration (you'll need to replace this with your own config)
const firebaseConfig = {
    apiKey: "AIzaSyClu-KtfMwnUGDBprTUI3hPE3XDybdVdXc",
    authDomain: "jtsla.com",
    projectId: "jtsla-5",
    storageBucket: "jtsla-5.appspot.com",
    messagingSenderId: "307455132051",
    appId: "1:307455132051:web:e53fb8782f0264b3596866",
    measurementId: "G-PQ7KXMMGSH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize the FirebaseUI Widget using Firebase
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            document.getElementById('user-content').style.display = 'block';
            loadUserContent();
            return false;
        },
        uiShown: function() {
            // The widget is rendered.
            document.getElementById('user-content').style.display = 'none';
        }
    },
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function() {
        window.location.assign('<your-privacy-policy-url>');
    }
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

function loadUserContent() {
    const positionList = document.getElementById('position-list');
    const database = firebase.database();

    // Listen for changes in the database and update the UI
    database.ref('positions').on('value', (snapshot) => {
        positionList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const position = childSnapshot.val();
            const li = document.createElement('li');
            li.className = position.color;
            li.textContent = position.position;
            positionList.appendChild(li);
        });
    });
}

// Check auth state
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        document.getElementById('user-content').style.display = 'block';
        loadUserContent();
    } else {
        // No user is signed in
        document.getElementById('user-content').style.display = 'none';
    }
});