// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCiAiKHAmdxIbCiFsOjLNGFFi8DKnO5y50",
  authDomain: "alterapprun22.firebaseapp.com",
  projectId: "alterapprun22",
  storageBucket: "alterapprun22.firebasestorage.app",
  messagingSenderId: "1086977518301",
  appId: "1:1086977518301:web:3020dd27b5e5fba18f8934",
  measurementId: "G-1KT2RT1095"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("✅ Firebase initialized");

// Set daily prompt
const prompts = [
  "What’s your Alter’s biggest fear?",
  "Describe your Alter’s perfect world.",
  "If your Alter ruled the internet for 24 hours…",
  "What’s something your Alter would never say?",
  "How would your Alter start a revolution?"
];

const dailyPromptEl = document.getElementById("daily-prompt");
const today = new Date().getDate() % prompts.length;
if (dailyPromptEl) {
  dailyPromptEl.textContent = `🧠 Prompt of the Day: ${prompts[today]}`;
}

// Post submission
const postForm = document.getElementById("post-form");
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const alter = document.getElementById("alterName").value.trim();
    const mood = document.getElementById("mood").value.trim();
    const text = document.getElementById("text").value.trim();

    if (!alter || !mood || !text) return alert("Please fill out all fields.");

    try {
      await addDoc(collection(db, "posts"), {
        alter,
        mood,
        text,
        createdAt: new Date()
      });
      console.log("✅ Post submitted");
      postForm.reset();
    } catch (err) {
      console.error("❌ Failed to post:", err);
      alert("Error posting: " + err.message);
    }
  });
}

// Load feed
const postsContainer = document.getElementById("posts");
if (postsContainer) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    postsContainer.innerHTML = "";
    snapshot.forEach((doc) => {
      const post = doc.data();
      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.innerHTML = `
        <div class="alter-name">${post.alter}</div>
        <div class="mood">Mood: ${post.mood}</div>
        <div class="text">${post.text}</div>
      `;
      postsContainer.appendChild(postEl);
    });
  });
}
