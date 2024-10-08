// Firebase configuration (you'll need to replace this with your own config)
const firebaseConfig = {
    apiKey: "AIzaSyClu-KtfMwnUGDBprTUI3hPE3XDybdVdXc",
    authDomain: "jtsla-5.firebaseapp.com", // Use your Firebase project domain, not your custom domain
    projectId: "jtsla-5",
    storageBucket: "jtsla-5.appspot.com",
    messagingSenderId: "307455132051",
    appId: "1:307455132051:web:e53fb8782f0264b3596866",
    measurementId: "G-PQ7KXMMGSH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // You can get the user's email here:
            const userEmail = authResult.user.email;
            checkAdminAndLoadContent(userEmail);
            return false;
        },
        uiShown: function() {
            // The widget is rendered.
            document.getElementById('admin-content').style.display = 'none';
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


function checkAdminAndLoadContent(userEmail) {
    const adminEmails = ['jahaanpriv@gmail.com', 'agarwal.abhinav22@gmail.com']; // Replace with your admin emails
    if (adminEmails.includes(userEmail)) {
        document.getElementById('admin-content').style.display = 'block';
        document.getElementById('firebaseui-auth-container').style.display = 'none';
        loadAdminFunctionality();
    } else {
        alert('You are not authorized to access this page.');
        firebase.auth().signOut().then(() => {
            document.getElementById('admin-content').style.display = 'none';
            document.getElementById('firebaseui-auth-container').style.display = 'block';
        });
    }
}

function loadAdminFunctionality() {
    const addPositionForm = document.getElementById('add-position-form');
    const positionList = document.getElementById('position-list');
    const database = firebase.database();

    addPositionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const position = document.getElementById('position').value;
        const color = document.getElementById('color').value;

        // Add position to Firebase
        const newPositionRef = database.ref('positions').push();
        newPositionRef.set({
            position: position,
            color: color
        });

        addPositionForm.reset();
    });

    // Listen for changes in the database and update the UI
    database.ref('positions').on('value', (snapshot) => {
        positionList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const position = childSnapshot.val();
            const li = document.createElement('li');
            li.className = position.color;
            
            const positionText = document.createElement('span');
            positionText.className = 'position-text';
            positionText.textContent = position.position;
            li.appendChild(positionText);
            
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';
            
            // Add remove button
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = () => {
                database.ref('positions/' + childSnapshot.key).remove();
            };
            
            // Add color toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = 'Toggle Color';
            toggleBtn.className = 'toggle-btn';
            toggleBtn.onclick = () => {
                const colors = ['green', 'red', 'blue', 'black'];
                const currentIndex = colors.indexOf(position.color);
                const newColor = colors[(currentIndex + 1) % colors.length];
                database.ref('positions/' + childSnapshot.key).update({ color: newColor });
            };
            
            buttonGroup.appendChild(removeBtn);
            buttonGroup.appendChild(toggleBtn);
            li.appendChild(buttonGroup);
            positionList.appendChild(li);
        });
    });

    // Add sign-out functionality
    document.getElementById('sign-out').addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
            document.getElementById('admin-content').style.display = 'none';
            document.getElementById('firebaseui-auth-container').style.display = 'block';
        }).catch((error) => {
            console.error('Sign Out Error', error);
        });
    });
}

// Check auth state
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        checkAdminAndLoadContent(user.email);
    } else {
        // No user is signed in
        document.getElementById('admin-content').style.display = 'none';
        document.getElementById('firebaseui-auth-container').style.display = 'block';
    }
});