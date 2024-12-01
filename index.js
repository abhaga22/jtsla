// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClu-KtfMwnUGDBprTUI3hPE3XDybdVdXc",
    authDomain: "jtsla-5.firebaseapp.com",
    projectId: "jtsla-5",
    storageBucket: "jtsla-5.appspot.com",
    messagingSenderId: "307455132051",
    appId: "1:307455132051:web:e53fb8782f0264b3596866",
    measurementId: "G-PQ7KXMMGSH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Handle big account inquiry
document.getElementById('inquiry-dropdown').addEventListener('change', function() {
    const contactInput = document.getElementById('contact-input');
    if (this.value) {
        contactInput.style.display = 'block';
    } else {
        contactInput.style.display = 'none';
    }
});

document.getElementById('submit-inquiry').addEventListener('click', function() {
    const accountType = document.getElementById('inquiry-dropdown').value;
    const contact = document.getElementById('contact-input').value;

    if (!accountType || !contact) {
        alert('Please select an account type and provide contact information.');
        return;
    }

    // Store inquiry in Firebase
    const inquiryRef = database.ref('inquiries');
    inquiryRef.push({
        accountType: accountType,
        contact: contact,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert('Inquiry submitted successfully!');
        document.getElementById('inquiry-dropdown').value = '';
        document.getElementById('contact-input').value = '';
        document.getElementById('contact-input').style.display = 'none';
    }).catch((error) => {
        console.error('Error submitting inquiry:', error);
        alert('Error submitting inquiry. Please try again.');
    });
});