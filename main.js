// Main JavaScript file for Alter Platform

// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile,
    onAuthStateChanged, 
    signInWithPopup, 
    GoogleAuthProvider, 
    OAuthProvider,
    signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    addDoc,
    setDoc, 
    serverTimestamp,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6o49UYokU6zZCKY1nUh7mQ3ayZsfXelQ",
    authDomain: "alter-platform.firebaseapp.com",
    projectId: "alter-platform",
    storageBucket: "alter-platform.appspot.com",
    messagingSenderId: "153036089847",
    appId: "1:153036089847:web:17cd103dd3f8ccade5a6f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
// Auth and UI elements
const authContainer = document.getElementById('auth-container');
const mainFeed = document.getElementById('main-feed');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginTabBtn = document.getElementById('login-tab-btn');
const signupTabBtn = document.getElementById('signup-tab-btn');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const goToSignup = document.getElementById('go-to-signup');
const goToLogin = document.getElementById('go-to-login');
const profileMenuToggle = document.getElementById('profile-menu-toggle');

// Mobile menu elements
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileSidebar = document.getElementById('mobile-sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

// Modal elements
const promptModal = document.getElementById('prompt-modal');
const respondPromptBtn = document.getElementById('respond-prompt-btn');
const closePromptModal = document.getElementById('close-prompt-modal');
const createAlterBtn = document.getElementById('create-alter-btn');
const createAlterModal = document.getElementById('create-alter-modal');
const closeCreateModal = document.getElementById('close-create-modal');
const submitPromptResponse = document.getElementById('submit-prompt-response');
const createAlterSubmit = document.getElementById('create-alter-submit');

// Password visibility toggles
const loginTogglePassword = document.getElementById('login-toggle-password');
const signupTogglePassword = document.getElementById('signup-toggle-password');
const loginPassword = document.getElementById('login-password');
const signupPassword = document.getElementById('signup-password');

// Post interaction elements
const postActions = document.querySelectorAll('.post-action');

// Password strength meter
const passwordStrengthMeter = document.getElementById('password-strength-meter');

// Mood slider
const moodSlider = document.getElementById('mood-slider');

// Current user state
let currentUser = null;
let userAlters = [];
let feedPosts = [];

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        currentUser = user;
        authContainer.style.display = 'none';
        mainFeed.style.display = 'block';
        showToast('Successfully logged in!', 'success');
        
        // Load user data
        loadUserData(user);
        
        // Load feed
        loadFeedPosts();
    } else {
        // User is signed out
        currentUser = null;
        authContainer.style.display = 'block';
        mainFeed.style.display = 'none';
    }
});

// Event Listeners for Document Load
document.addEventListener('DOMContentLoaded', () => {
    // Auth Tab Switching
    loginTabBtn.addEventListener('click', () => switchTab('login'));
    signupTabBtn.addEventListener('click', () => switchTab('signup'));
    goToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('signup');
    });
    goToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('login');
    });

    // Mobile Menu
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    closeSidebar.addEventListener('click', closeMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);

    // Authentication Forms
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Social Auth
    document.getElementById('google-login').addEventListener('click', () => signInWithGoogle());
    document.getElementById('google-signup').addEventListener('click', () => signInWithGoogle());
    document.getElementById('apple-login').addEventListener('click', () => signInWithApple());
    document.getElementById('apple-signup').addEventListener('click', () => signInWithApple());

    // Password Toggles
    loginTogglePassword.addEventListener('click', () => togglePasswordVisibility(loginPassword, loginTogglePassword));
    signupTogglePassword.addEventListener('click', () => togglePasswordVisibility(signupPassword, signupTogglePassword));
    
    // Password Strength Meter
    signupPassword.addEventListener('input', updatePasswordStrength);

    // Modals
    respondPromptBtn.addEventListener('click', () => openModal(promptModal));
    closePromptModal.addEventListener('click', () => closeModal(promptModal));
    createAlterBtn.addEventListener('click', () => openModal(createAlterModal));
    closeCreateModal.addEventListener('click', () => closeModal(createAlterModal));
    
    // Submit handlers for modals
    submitPromptResponse.addEventListener('click', handlePromptResponse);
    createAlterSubmit.addEventListener('click', handleCreateAlter);
    
    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Post interactions
    setupPostInteractions();
    
    // Mood slider
    moodSlider.addEventListener('input', updateMood);
    
    // Profile menu toggle
    profileMenuToggle.addEventListener('click', handleProfileMenuToggle);
    
    // Add logout functionality
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.querySelector('.menu-text').textContent === 'Settings') {
            item.addEventListener('click', showSettingsMenu);
        }
    });
});

// Tab Switching Logic
function switchTab(tab) {
    if (tab === 'login') {
        loginTabBtn.classList.add('active');
        signupTabBtn.classList.remove('active');
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginTabBtn.classList.remove('active');
        signupTabBtn.classList.add('active');
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
    }
}

// Mobile Menu Functions
function toggleMobileMenu() {
    mobileSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Modal Functions
function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => closeModal(modal));
}

// Password Toggle
function togglePasswordVisibility(passwordField, toggleIcon) {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    toggleIcon.classList.toggle('fa-eye');
    toggleIcon.classList.toggle('fa-eye-slash');
}

// Password Strength Meter
function updatePasswordStrength() {
    const password = signupPassword.value;
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 25; // Lowercase
    if (/[A-Z]/.test(password)) strength += 25; // Uppercase
    if (/[0-9]/.test(password) || /[!@#$%^&*]/.test(password)) strength += 25; // Numbers or special chars
    
    // Update the meter class based on strength
    passwordStrengthMeter.className = 'password-strength-fill';
    if (strength <= 25) {
        passwordStrengthMeter.classList.add('strength-weak');
    } else if (strength <= 50) {
        passwordStrengthMeter.classList.add('strength-fair');
    } else if (strength <= 75) {
        passwordStrengthMeter.classList.add('strength-good');
    } else {
        passwordStrengthMeter.classList.add('strength-strong');
    }
}

// Toast Notification
function showToast(message, type) {
    const toastContainer = document.getElementById('toast-container');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Create toast content
    const toastContent = document.createElement('div');
    toastContent.className = 'toast-content';
    
    // Create icon
    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    icon.innerHTML = type === 'success' 
        ? '<i class="fas fa-check-circle"></i>' 
        : '<i class="fas fa-exclamation-circle"></i>';
    
    // Create message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'toast-message';
    messageDiv.textContent = message;
    
    // Assemble toast
    toastContent.appendChild(icon);
    toastContent.appendChild(messageDiv);
    toast.appendChild(toastContent);
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide and remove toast after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(error => {
        error.style.display = 'none';
    });
    
    // Validate form
    let isValid = true;
    
    if (!email) {
        document.getElementById('login-email-error').style.display = 'block';
        isValid = false;
    }
    
    if (!password) {
        document.getElementById('login-password-error').style.display = 'block';
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading state
    const loginButton = document.getElementById('login-button');
    const originalText = loginButton.textContent;
    loginButton.innerHTML = '<span class="loading-spinner"></span> Logging In...';
    loginButton.disabled = true;
    
    try {
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Signed in
        const user = userCredential.user;
        console.log('User logged in:', user.email);
        loginForm.reset();
    } catch (error) {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        
        console.error('Login error:', errorCode, errorMessage);
        
        // Display error message
        const loginError = document.getElementById('login-error');
        
        if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
            loginError.textContent = 'Invalid email or password';
        } else if (errorCode === 'auth/too-many-requests') {
            loginError.textContent = 'Too many failed login attempts. Try again later.';
        } else {
            loginError.textContent = errorMessage;
        }
        
        loginError.style.display = 'block';
        showToast('Login failed: ' + loginError.textContent, 'error');
    } finally {
        // Restore button state
        loginButton.innerHTML = originalText;
        loginButton.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(error => {
        error.style.display = 'none';
    });
    
    // Validate form
    let isValid = true;
    
    if (!name) {
        document.getElementById('signup-name-error').style.display = 'block';
        isValid = false;
    }
    
    if (!email) {
        document.getElementById('signup-email-error').style.display = 'block';
        isValid = false;
    }
    
    if (!password || password.length < 8) {
        document.getElementById('signup-password-error').style.display = 'block';
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('signup-confirm-error').style.display = 'block';
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading state
    const signupButton = document.getElementById('signup-button');
    const originalText = signupButton.textContent;
    signupButton.innerHTML = '<span class="loading-spinner"></span> Creating Account...';
    signupButton.disabled = true;
    
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Signed in 
        const user = userCredential.user;
        
        // Update profile
        await updateProfile(user, {
            displayName: name
        });
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            createdAt: serverTimestamp()
        });
        
        console.log('User created successfully');
        signupForm.reset();
        showToast('Account created successfully!', 'success');
        
        // Create default alter
        const defaultAlter = {
            name: 'Veritas',
            personality: 'honest',
            description: 'A brutally honest alter ego that speaks the truth, even when it hurts.',
            traits: ['Honest', 'Critical', 'Thoughtful'],
            mood: 50
        };
        
        await addDoc(collection(db, 'users', user.uid, 'alters'), {
            ...defaultAlter,
            createdAt: serverTimestamp()
        });
        
    } catch (error) {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        
        console.error('Signup error:', errorCode, errorMessage);
        
        // Display error message
        const signupError = document.getElementById('signup-error');
        
        if (errorCode === 'auth/email-already-in-use') {
            signupError.textContent = 'Email is already in use';
        } else if (errorCode === 'auth/invalid-email') {
            signupError.textContent = 'Invalid email address';
        } else if (errorCode === 'auth/weak-password') {
            signupError.textContent = 'Password is too weak';
        } else {
            signupError.textContent = errorMessage;
        }
        
        signupError.style.display = 'block';
        showToast('Signup failed: ' + signupError.textContent, 'error');
    } finally {
        // Restore button state
        signupButton.innerHTML = originalText;
        signupButton.disabled = false;
    }
}

async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        
        // Check if user document exists in Firestore
        const user = result.user;
        const userDocRef = doc(db, 'users', user.uid);
        
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
            // Create user document if it doesn't exist
            await setDoc(userDocRef, {
                name: user.displayName || 'Google User',
                email: user.email,
                createdAt: serverTimestamp()
            });
            
            // Create default alter for new users
            const defaultAlter = {
                name: 'Veritas',
                personality: 'honest',
                description: 'A brutally honest alter ego that speaks the truth, even when it hurts.',
                traits: ['Honest', 'Critical', 'Thoughtful'],
                mood: 50
            };
            
            await addDoc(collection(db, 'users', user.uid, 'alters'), {
                ...defaultAlter,
                createdAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Google sign-in error:', error);
        showToast('Google sign-in failed', 'error');
    }
}

async function signInWithApple() {
    const provider = new OAuthProvider('apple.com');
    try {
        const result = await signInWithPopup(auth, provider);
        
        // Check if user document exists in Firestore
        const user = result.user;
        const userDocRef = doc(db, 'users', user.uid);
        
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
            // Create user document if it doesn't exist
            await setDoc(userDocRef, {
                name: user.displayName || 'Apple User',
                email: user.email,
                createdAt: serverTimestamp()
            });
            
            // Create default alter for new users
            const defaultAlter = {
                name: 'Veritas',
                personality: 'honest',
                description: 'A brutally honest alter ego that speaks the truth, even when it hurts.',
                traits: ['Honest', 'Critical', 'Thoughtful'],
                mood: 50
            };
            
            await addDoc(collection(db, 'users', user.uid, 'alters'), {
                ...defaultAlter,
                createdAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Apple sign-in error:', error);
        showToast('Apple sign-in failed', 'error');
    }
}

// Logout function
async function handleLogout() {
    try {
        await signOut(auth);
        showToast('Logged out successfully', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out', 'error');
    }
}

// Profile dropdown menu
function handleProfileMenuToggle() {
    // Check if menu already exists and remove it if it does
    const existingMenu = document.querySelector('.profile-dropdown-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    // Create dropdown menu
    const menu = document.createElement('div');
    menu.className = 'profile-dropdown-menu';
    menu.style.position = 'absolute';
    menu.style.top = '70px';
    menu.style.right = '20px';
    menu.style.backgroundColor = 'var(--card-bg)';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = 'var(--shadow)';
    menu.style.padding = '10px 0';
    menu.style.zIndex = '1000';
    menu.style.minWidth = '150px';
    
    // Add menu items
    const menuItems = [
        { text: 'My Profile', icon: 'user' },
        { text: 'My Alters', icon: 'brain' },
        { text: 'Settings', icon: 'cog' },
        { text: 'Log Out', icon: 'sign-out-alt' }
    ];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'profile-menu-item';
        menuItem.style.padding = '10px 15px';
        menuItem.style.display = 'flex';
        menuItem.style.alignItems = 'center';
        menuItem.style.cursor = 'pointer';
        menuItem.style.transition = 'background 0.2s';
        
        menuItem.innerHTML = `
            <i class="fas fa-${item.icon}" style="margin-right: 10px; color: var(--text-tertiary);"></i>
            <span>${item.text}</span>
        `;
        
        menuItem.addEventListener('mouseover', () => {
            menuItem.style.backgroundColor = 'var(--background)';
        });
        
        menuItem.addEventListener('mouseout', () => {
            menuItem.style.backgroundColor = 'transparent';
        });
        
        // Add click event
        menuItem.addEventListener('click', () => {
            // Handle menu item clicks
            if (item.text === 'Log Out') {
                handleLogout();
            } else {
                showToast(`${item.text} coming soon`, 'success');
            }
            menu.remove();
        });
        
        menu.appendChild(menuItem);
    });
    
    // Add to DOM
    document.body.appendChild(menu);
    
    // Close when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== profileMenuToggle) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
}

// Show settings menu
function showSettingsMenu() {
    // Create settings modal
    const settingsModal = document.createElement('div');
    settingsModal.className = 'modal show';
    settingsModal.style.position = 'fixed';
    settingsModal.style.top = '0';
    settingsModal.style.left = '0';
    settingsModal.style.width = '100%';
    settingsModal.style.height = '100%';
    settingsModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    settingsModal.style.display = 'flex';
    settingsModal.style.alignItems = 'center';
    settingsModal.style.justifyContent = 'center';
    settingsModal.style.zIndex = '2000';
    
    // Modal content
    settingsModal.innerHTML = `
        <div class="modal-content" style="width: 90%; max-width: 500px;">
            <div class="modal-header">
                <h3 class="modal-title">Settings</h3>
                <button class="modal-close" id="close-settings-modal" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="settings-content" style="margin-top: 20px;">
                <div class="input-group">
                    <label class="input-label">Account</label>
                    <button class="auth-button" id="logout-button" style="margin-top: 10px;">Log Out</button>
                </div>
                
                <div class="input-group" style="margin-top: 20px;">
                    <label class="input-label">Theme</label>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button class="theme-button" data-theme="light" style="flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 8px; background-color: white; color: #333;">Light</button>
                        <button class="theme-button" data-theme="dark" style="flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 8px; background-color: #333; color: white;">Dark</button>
                    </div>
                </div>
                
                <div class="input-group" style="margin-top: 20px;">
                    <label class="input-label">Notifications</label>
                    <div style="display: flex; align-items: center; margin-top: 10px;">
                        <label class="switch" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                            <input type="checkbox" checked style="opacity: 0; width: 0; height: 0;">
                            <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--primary); border-radius: 34px; transition: .4s;"></span>
                        </label>
                        <span style="margin-left: 10px;">Enable notifications</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(settingsModal);
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    settingsModal.querySelector('#close-settings-modal').addEventListener('click', () => {
        settingsModal.remove();
        document.body.style.overflow = '';
    });
    
    settingsModal.querySelector('#logout-button').addEventListener('click', () => {
        handleLogout();
        settingsModal.remove();
        document.body.style.overflow = '';
    });
    
    // Theme buttons
    settingsModal.querySelectorAll('.theme-button').forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            // Apply theme (could be expanded to actually change theme)
            showToast(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme coming soon`, 'success');
        });
    });
}

// Load User Data
async function loadUserData(user) {
    if (!user) return;
    
    // Update UI with user info
    document.querySelectorAll('.profile-avatar').forEach(avatar => {
        if (user.displayName) {
            const initials = user.displayName.split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase();
            avatar.textContent = initials;
        } else {
            avatar.textContent = user.email[0].toUpperCase();
        }
    });
    
    // Load user's alters from Firestore
    try {
        const altersSnapshot = await getDocs(collection(db, 'users', user.uid, 'alters'));
        userAlters = [];
        
        altersSnapshot.forEach(doc => {
            userAlters.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // If user has no alters, create default alter
        if (userAlters.length === 0) {
            const defaultAlter = {
                name: 'Veritas',
                personality: 'honest',
                description: 'A brutally honest alter ego that speaks the truth, even when it hurts.',
                traits: ['Honest', 'Critical', 'Thoughtful'],
                mood: 50
            };
            
            const docRef = await addDoc(collection(db, 'users', user.uid, 'alters'), {
                ...defaultAlter,
                createdAt: serverTimestamp()
            });
            
            userAlters.push({
                id: docRef.id,
                ...defaultAlter,
                createdAt: new Date()
            });
        }
        
        // Update UI with user's primary alter
        const primaryAlter = userAlters[0];
        updateAlterUI(primaryAlter);
        
        // Update alter dropdown in prompt modal
        updateAlterDropdown();
        
        console.log('User alters loaded:', userAlters.length);
    } catch (error) {
        console.error('Error loading alters:', error);
        showToast('Error loading your alters', 'error');
    }
}

// Update UI with alter info
function updateAlterUI(alter) {
    if (!alter) return;
    
    // Update profile card
    const profileCard = document.querySelector('.profile-card');
    const avatarLarge = profileCard.querySelector('.profile-avatar-large');
    const profileName = profileCard.querySelector('.profile-name');
    const personalityTags = profileCard.querySelector('.personality-tags');
    const moodSlider = profileCard.querySelector('#mood-slider');
    
    // Update avatar and name
    avatarLarge.textContent = alter.name[0].toUpperCase();
    avatarLarge.className = `profile-avatar-large avatar-${alter.personality}`;
    profileName.textContent = alter.name;
    
    // Update personality tags
    personalityTags.innerHTML = '';
    alter.traits.forEach(trait => {
        const tag = document.createElement('div');
        tag.className = 'personality-tag';
        tag.textContent = trait;
        personalityTags.appendChild(tag);
    });
    
    // Update mood slider
    moodSlider.value = alter.mood || 50;
    
    // Update memory card
    const memoryCard = document.querySelector('.memory-card');
    const cardTitle = memoryCard.querySelector('.card-title');
    cardTitle.textContent = `${alter.name} Memories`;
}

// Update alter dropdown in prompt modal
function updateAlterDropdown() {
    const alterSelect = document.getElementById('alter-select');
    alterSelect.innerHTML = '';
    
    userAlters.forEach(alter => {
        const option = document.createElement('option');
        option.value = alter.id;
        option.textContent = `${alter.name} (${alter.personality})`;
        alterSelect.appendChild(option);
    });
}

// Load feed posts
async function loadFeedPosts() {
    // For a real app, this would load posts from Firestore
    // For demo purposes, we'll just use the static content already in the HTML
    setupPostInteractions();
}

// Setup post interactions
function setupPostInteractions() {
    const postActions = document.querySelectorAll('.post-action');
    
    postActions.forEach(action => {
        action.addEventListener('click', handlePostAction);
    });
}

// Handle post actions
function handlePostAction(e) {
    const action = e.currentTarget;
    const actionType = action.querySelector('span')?.textContent;
    
    if (!actionType) return;
    
    if (actionType === 'Resonate' || actionType === 'Resonated') {
        action.classList.toggle('resonated');
        if (action.classList.contains('resonated')) {
            action.querySelector('span').textContent = 'Resonated';
            showToast('Post resonated!', 'success');
        } else {
            action.querySelector('span').textContent = 'Resonate';
        }
    } else if (actionType === 'React') {
        // Create and show react modal
        showReactModal(action);
    } else if (actionType === 'Share') {
        showShareModal(action);
    } else if (actionType === 'Ask') {
        showAskModal(action);
    }
}

// Create and show a modal for reacting to posts
function showReactModal(actionElement) {
    // Get post info
    const postCard = actionElement.closest('.post-card') || actionElement.closest('.comment-card');
    const postName = postCard.querySelector('.post-name').textContent.split(' ')[0];
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal show';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">React to ${postName}'s Post</h3>
                <button class="modal-close" id="close-react-modal" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="input-group">
                <label for="react-text" class="input-label">Your Reaction</label>
                <textarea id="react-text" class="input-field" rows="4" placeholder="Share your thoughts..."></textarea>
            </div>
            <div class="input-group">
                <label for="react-alter-select" class="input-label">React as</label>
                <select id="react-alter-select" class="input-field">
                    ${userAlters.map(alter => `
                        <option value="${alter.id}">${alter.name} (${alter.personality})</option>
                    `).join('')}
                </select>
            </div>
            <button class="auth-button" id="submit-react">Post Reaction</button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    modal.querySelector('#close-react-modal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.querySelector('#submit-react').addEventListener('click', () => {
        const reaction = modal.querySelector('#react-text').value;
        const alterId = modal.querySelector('#react-alter-select').value;
        
        if (!reaction) {
            showToast('Please write a reaction', 'error');
            return;
        }
        
        // Get the selected alter
        const selectedAlter = userAlters.find(alter => alter.id === alterId);
        
        // Create and add the reaction to the UI
        addReactionToUI(postCard, selectedAlter, reaction);
        
        // Close modal
        modal.remove();
        document.body.style.overflow = '';
        
        showToast('Reaction posted!', 'success');
    });
}

// Add reaction to UI
function addReactionToUI(postCard, alter, reaction) {
    // Get the parent element to add the comment to
    let commentThread = postCard.nextElementSibling;
    
    // If there's no comment thread after this post, create one
    if (!commentThread || !commentThread.classList.contains('comment-thread')) {
        commentThread = document.createElement('div');
        commentThread.className = 'comment-thread';
        commentThread.innerHTML = '<div class="thread-line"></div>';
        postCard.after(commentThread);
    }
    
    // Create the comment card
    const commentCard = document.createElement('div');
    commentCard.className = 'comment-card';
    
    // Get a random mood emoji
    const moods = ['😊', '😐', '🤔', '😂', '😄', '🙄', '😑', '🤪'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    commentCard.innerHTML = `
        <div class="post-header">
            <div class="post-avatar avatar-${alter.personality}">${alter.name[0]}</div>
            <div class="post-user-info">
                <div class="post-name">${alter.name} <span class="personality-badge badge-${alter.personality}">${alter.personality}</span></div>
                <div class="post-meta">Your Alter • Just now</div>
            </div>
            <div class="post-mood">${randomMood}</div>
        </div>
        <div class="post-content">
            <p>${reaction}</p>
        </div>
        <div class="post-actions">
            <div class="post-action">
                <i class="fas fa-heart"></i>
                <span>Resonate</span>
            </div>
            <div class="post-action">
                <i class="fas fa-comment"></i>
                <span>React</span>
            </div>
        </div>
    `;
    
    // Add to the comment thread
    commentThread.appendChild(commentCard);
    
    // Setup interaction for the new comment
    setupPostInteractions();
    
    // Scroll to the new comment
    commentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Share modal
function showShareModal(actionElement) {
    // Get post info
    const postCard = actionElement.closest('.post-card') || actionElement.closest('.comment-card');
    const postName = postCard.querySelector('.post-name').textContent.split(' ')[0];
    const postContent = postCard.querySelector('.post-content').textContent.trim();
    
    // Create shortened content for sharing
    const shortContent = postContent.length > 100 
        ? postContent.substring(0, 97) + '...'
        : postContent;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal show';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Share ${postName}'s Post</h3>
                <button class="modal-close" id="close-share-modal" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="margin: 20px 0; padding: 15px; background-color: var(--background); border-radius: 8px;">
                <p style="margin-bottom: 10px; font-style: italic;">${shortContent}</p>
                <p style="color: var(--text-tertiary); font-size: 14px;">- ${postName}</p>
            </div>
            <div class="input-group">
                <label class="input-label">Share to</label>
                <div style="display: flex; gap: 15px; margin-top: 10px;">
                    <button class="social-button">
                        <i class="fab fa-twitter"></i>
                        Twitter
                    </button>
                    <button class="social-button">
                        <i class="fab fa-facebook"></i>
                        Facebook
                    </button>
                    <button class="social-button">
                        <i class="fas fa-link"></i>
                        Copy Link
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    modal.querySelector('#close-share-modal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    // Add click events for share buttons
    modal.querySelectorAll('.social-button').forEach(button => {
        button.addEventListener('click', () => {
            showToast('Sharing coming soon!', 'success');
            modal.remove();
            document.body.style.overflow = '';
        });
    });
}

// Ask modal
function showAskModal(actionElement) {
    // Get post info
    const postCard = actionElement.closest('.post-card') || actionElement.closest('.comment-card');
    const postName = postCard.querySelector('.post-name').textContent.split(' ')[0];
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal show';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Ask ${postName} a Question</h3>
                <button class="modal-close" id="close-ask-modal" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="input-group">
                <label for="question-text" class="input-label">Your Question</label>
                <textarea id="question-text" class="input-field" rows="3" placeholder="What would you like to ask?"></textarea>
            </div>
            <div class="input-group">
                <label for="ask-alter-select" class="input-label">Ask as</label>
                <select id="ask-alter-select" class="input-field">
                    ${userAlters.map(alter => `
                        <option value="${alter.id}">${alter.name} (${alter.personality})</option>
                    `).join('')}
                </select>
            </div>
            <button class="auth-button" id="submit-question">Ask Question</button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    modal.querySelector('#close-ask-modal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.querySelector('#submit-question').addEventListener('click', () => {
        const question = modal.querySelector('#question-text').value;
        
        if (!question) {
            showToast('Please write a question', 'error');
            return;
        }
        
        // For demo, we'll just show a success message
        showToast('Question sent! Answers will appear in your feed soon.', 'success');
        
        // Close modal
        modal.remove();
        document.body.style.overflow = '';
    });
}

// Modal Form Handlers
async function handlePromptResponse() {
    const response = document.getElementById('response-text').value;
    const alterId = document.getElementById('alter-select').value;
    
    if (!response) {
        showToast('Please write a response', 'error');
        return;
    }
    
    if (!alterId) {
        showToast('Please select an alter', 'error');
        return;
    }
    
    // Get the selected alter
    const selectedAlter = userAlters.find(alter => alter.id === alterId);
    
    try {
        // In a real app, this would save the response to Firestore
        // For demo, we'll add it directly to the UI
        addPromptResponseToUI(selectedAlter, response);
        
        showToast('Response posted successfully!', 'success');
        closeModal(promptModal);
        
        // Reset form
        document.getElementById('response-text').value = '';
    } catch (error) {
        console.error('Error posting response:', error);
        showToast('Error posting response', 'error');
    }
}

// Add prompt response to UI
function addPromptResponseToUI(alter, response) {
    // Create new post card
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    
    // Get today's prompt
    const promptContent = document.querySelector('.prompt-content').textContent;
    
    // Get a random mood emoji
    const moods = ['😊', '😐', '🤔', '😂', '😄', '🙄', '😑', '🤪'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    postCard.innerHTML = `
        <div class="post-header">
            <div class="post-avatar avatar-${alter.personality}">${alter.name[0]}</div>
            <div class="post-user-info">
                <div class="post-name">${alter.name} <span class="personality-badge badge-${alter.personality}">${alter.personality}</span></div>
                <div class="post-meta">Your Alter • Just now</div>
            </div>
            <div class="post-mood">${randomMood}</div>
        </div>
        <div class="post-content">
            <p><strong>Prompt:</strong> ${promptContent}</p>
            <p>${response}</p>
        </div>
        <div class="post-actions">
            <div class="post-action">
                <i class="fas fa-heart"></i>
                <span>Resonate</span>
            </div>
            <div class="post-action">
                <i class="fas fa-comment"></i>
                <span>React</span>
            </div>
            <div class="post-action">
                <i class="fas fa-share"></i>
                <span>Share</span>
            </div>
            <div class="post-action">
                <i class="fas fa-question-circle"></i>
                <span>Ask</span>
            </div>
        </div>
    `;
    
    // Add to DOM at the beginning of the feed
    const dailyPrompt = document.querySelector('.daily-prompt');
    dailyPrompt.after(postCard);
    
    // Setup interactions for the new post
    setupPostInteractions();
    
    // Scroll to the new post
    postCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function handleCreateAlter() {
    const alterName = document.getElementById('alter-name').value;
    const alterDescription = document.getElementById('alter-description').value;
    
    if (!alterName) {
        showToast('Please give your alter a name', 'error');
        return;
    }
    
    if (!alterDescription) {
        showToast('Please describe your alter', 'error');
        return;
    }
    
    // Get selected personality traits
    const selectedTraits = [];
    document.querySelectorAll('.personality-tag.selected').forEach(tag => {
        selectedTraits.push(tag.textContent);
    });
    
    if (selectedTraits.length === 0) {
        // Get the first 3 traits by default
        const allTraits = document.querySelectorAll('.personality-tag');
        for (let i = 0; i < 3 && i < allTraits.length; i++) {
            selectedTraits.push(allTraits[i].textContent);
        }
    }
    
    // Determine personality type based on traits
    let personality = 'honest'; // default
    if (selectedTraits.includes('Creative') || selectedTraits.includes('Poetic')) {
        personality = 'poetic';
    } else if (selectedTraits.includes('Chaotic') || selectedTraits.includes('Adventurous')) {
        personality = 'chaotic';
    }
    
    try {
        // Create new alter object
        const newAlter = {
            name: alterName,
            description: alterDescription,
            traits: selectedTraits,
            personality: personality,
            mood: 50,
            createdAt: new Date()
        };
        
        // In a real app, this would save to Firestore
        if (currentUser) {
            // For demo, we'll just add it to our local array
            // In real app: await addDoc(collection(db, 'users', currentUser.uid, 'alters'), newAlter);
            newAlter.id = 'alter-' + Date.now(); // Generate temporary ID
            userAlters.push(newAlter);
            
            // Update UI
            updateAlterDropdown();
            
            showToast('Alter created successfully!', 'success');
            closeModal(createAlterModal);
            
            // Reset form
            document.getElementById('alter-name').value = '';
            document.getElementById('alter-description').value = '';
            
            // Add to right sidebar
            addAlterToSidebar(newAlter);
        }
    } catch (error) {
        console.error('Error creating alter:', error);
        showToast('Error creating alter', 'error');
    }
}

// Add new alter to sidebar
function addAlterToSidebar(alter) {
    // Create discover item for the new alter
    const discoverCard = document.querySelector('.discover-card');
    const discoverItem = document.createElement('div');
    discoverItem.className = 'discover-item';
    
    discoverItem.innerHTML = `
        <div class="discover-avatar">${alter.name[0]}</div>
        <div class="discover-info">
            <div class="discover-name">${alter.name}</div>
            <div class="discover-personality">${alter.traits.slice(0, 2).join(', ').toLowerCase()}</div>
        </div>
        <button class="follow-button">Switch</button>
    `;
    
    // Add to discover card
    discoverCard.appendChild(discoverItem);
    
    // Add click event for switch button
    discoverItem.querySelector('.follow-button').addEventListener('click', () => {
        updateAlterUI(alter);
        showToast(`Switched to ${alter.name}`, 'success');
    });
}

// Mood Slider Update
function updateMood(e) {
    const value = e.target.value;
    let emoji = '😐';
    
    if (value < 20) {
        emoji = '😢';
    } else if (value < 40) {
        emoji = '😕';
    } else if (value < 60) {
        emoji = '😐';
    } else if (value < 80) {
        emoji = '😊';
    } else {
        emoji = '😁';
    }
    
    // Update UI
    // In a real app, this would update the mood in Firestore
    if (userAlters.length > 0) {
        userAlters[0].mood = value;
    }
    
    // Show toast
    showToast(`Mood updated: ${emoji}`, 'success');
}

// Initialize personality tag selection in create alter modal
document.addEventListener('DOMContentLoaded', () => {
    const createModal = document.getElementById('create-alter-modal');
    if (createModal) {
        const personalityTags = createModal.querySelectorAll('.personality-tag');
        
        personalityTags.forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
                
                // Add a visual indicator for selected state
                if (tag.classList.contains('selected')) {
                    tag.style.backgroundColor = 'var(--primary)';
                    tag.style.color = 'white';
                } else {
                    tag.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
                    tag.style.color = 'var(--primary)';
                }
            });
        });
    }
});