// Firebase Configuration (Replace with your keys)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Dark Mode Toggle
document.getElementById('darkModeBtn').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
// Teacher Signup
document.getElementById('signupBtn').addEventListener('click', () => {
    const email = prompt("Enter your email:");
    const password = prompt("Create a password:");
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert("Account created!"))
        .catch(error => alert(error.message));
});

// Teacher Login
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById('teacherPanel').classList.remove('hidden');
            alert("Logged in!");
        })
        .catch(error => alert(error.message));
});

// Create Post with PDF
async function createPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const file = document.getElementById('pdfUpload').files[0];

    // Upload PDF
    const storageRef = storage.ref(`pdfs/${file.name}`);
    await storageRef.put(file);
    const pdfUrl = await storageRef.getDownloadURL();

    // Save to Firestore
    db.collection('lessons').add({
        title,
        content,
        pdfUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Lesson published!");
}
// Real-Time Lesson Feed
db.collection('lessons')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
        const feed = document.getElementById('lessonFeed');
        feed.innerHTML = "";
        snapshot.forEach(doc => {
            const lesson = doc.data();
            feed.innerHTML += `
                <div class="lesson-card">
                    <h3>${lesson.title}</h3>
                    <p>${lesson.content}</p>
                    <a href="${lesson.pdfUrl}" download>📥 Download PDF</a>
                </div>
            `;
        });
    });