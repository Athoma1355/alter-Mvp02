/* Base styles and reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #6366f1;
    --primary-hover: #4f46e5;
    --secondary-color: #ec4899;
    --text-primary: #1f2937;
    --text-secondary: #4b5563;
    --text-light: #9ca3af;
    --bg-primary: #f9fafb;
    --bg-secondary: #ffffff;
    --bg-tertiary: #f3f4f6;
    --border-color: #e5e7eb;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --radius: 8px;
}

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
}

a {
    text-decoration: none;
    color: inherit;
}

button {
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    font-family: inherit;
}

/* Layout */
.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content {
    display: flex;
    flex: 1;
    padding: 1.5rem;
    gap: 1.5rem;
    max-width: 1600px;
    margin: 0 auto;
    width: 100%;
}

/* Navigation */
.main-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: var(--bg-secondary);
    box-shadow: var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;
}

.logo h1 {
    color: var(--primary-color);
    font-size: 1.75rem;
    font-weight: 700;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-links a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius);
    transition: all 0.2s ease;
}

.nav-links a:hover, .nav-links a.active {
    color: var(--primary-color);
    background-color: rgba(99, 102, 241, 0.1);
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius);
    border: 1px solid var(--border-color);
    cursor: pointer;
}

.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
}

/* Sidebars */
.left-sidebar, .right-sidebar {
    flex: 0 0 260px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.my-alters, .daily-prompts, .trending-alters, .mood-filter {
    background-color: var(--bg-secondary);
    border-radius: var(--radius);
    padding: 1.25rem;
    box-shadow: var(--shadow);
}

.my-alters h3, .daily-prompts h3, .trending-alters h3, .mood-filter h3 {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: var(--text-primary);
}

/* Alter list */
.alter-list, .trending-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.alter-item, .trending-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: var(--radius);
    transition: all 0.2s ease;
}

.alter-item:hover, .trending-item:hover {
    background-color: var(--bg-tertiary);
}

.alter-avatar, .comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.alter-info, .trending-info {
    display: flex;
    flex-direction: column;
}

.alter-name, .trending-name {
    font-weight: 500;
    color: var(--text-primary);
}

.alter-mood, .trending-stat {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.create-alter-btn {
    margin-top: 0.5rem;
    padding: 0.75rem;
    width: 100%;
    text-align: center;
    background-color: rgba(99, 102, 241, 0.1);
    color: var(--primary-color);
    font-weight: 500;
    border-radius: var(--radius);
    transition: all 0.2s ease;
}

.create-alter-btn:hover {
    background-color: rgba(99, 102, 241, 0.2);
}

/* Prompts */
.prompt-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.prompt-item {
    background-color: var(--bg-tertiary);
    padding: 1rem;
    border-radius: var(--radius);
    border-left: 3px solid var(--primary-color);
}

.prompt-item p {
    font-style: italic;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
}

.use-prompt-btn {
    font-size: 0.85rem;
    color: var(--primary-color);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.use-prompt-btn:hover {
    text-decoration: underline;
}

/* Mood filter */
.mood-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.mood-btn {
    padding: 0.5rem 0.75rem;
    background-color: var(--bg-tertiary);
    border-radius: var(--radius);
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.mood-btn:hover {
    background-color: rgba(99, 102, 241, 0.1);
    color: var(--primary-color);
}

/* Feed Container */
.feed-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Post Composer */
.post-composer {
    background-color: var(--bg-secondary);
    border-radius: var(--radius);
    padding: 1.25rem;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.composer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.alter-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

#alter-select {
    padding: 0.5rem;
    border-radius: var(--radius);
    border: 1px solid var(--border-color);
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    font-weight: 500;
}

.mood-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.mood-slider-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.mood-slider {
    width: 150px;
    -webkit-appearance: none;
    height: 5px;
    border-radius: 5px;
    background: linear-gradient(to right, #ff5f6d, #ffc371, #88d3ce);
    outline: none;
}

.mood-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
}

.mood-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.post-composer textarea {
    padding: 0.75rem;
    border-radius: var(--radius);
    border: 1px solid var(--border-color);
    resize: none;
    height: 100px;
    font-family: inherit;
}

.composer-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.composer-tools {
    display: flex;
    gap: 0.75rem;
}

.composer-tools button {
    padding: 0.5rem;
    border-radius: var(--radius);
    color: var(--text-secondary);
    transition: all 0.2s ease;
}

.composer-tools button:hover {
    background-color: var(--bg-tertiary);
    color: var(--primary-color);
}

.post-btn {
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: white;
    font-weight: 500;
    border-radius: var(--radius);
    transition: all 0.2s ease;
}

.post-btn:hover {
    background-color: var(--primary-hover);
}

/* Feed */
.feed {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.post-card {
    background-color: var(--bg-secondary);
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.post-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.post-info {
    display: flex;
    flex-direction: column;
}

.post-author {
    font-weight: 600;
    color: var(--text-primary);
}

.post-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-light);
}

.post-mood {
    padding: 0.125rem 0.5rem;
    background-color: rgba(99, 102, 241, 0.1);
    color: var(--primary-color);
    border-radius: 12px;
    font-weight: 500;
}

.post-content {
    font-size: 1.05rem;
    line-height: 1.6;
}

.post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
}

.post-actions {
    display: flex;
    gap: 1rem;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    transition: all 0.2s ease;
}

.action-btn:hover {
    color: var(--primary-color);
}

.post-comments {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
}

.comment {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: var(--radius);
    background-color: var(--bg-tertiary);
}

.comment-content {
    flex: 1;
}

.comment-author {
    font-weight: 500;
    margin-bottom: 0.25rem;
    color: var(--text-primary);
}

/* Modals */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.modal.active {
    display: flex;
}

.modal-content {
    background-color: var(--bg-secondary);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    border-bottom: 1px solid var(--border-color);
}

.close-modal {
    font-size: 1.5rem;
    color: var(--text-light);
    transition: all 0.2s ease;
}

.close-modal:hover {
    color: var(--text-primary);
}

.modal-body {
    padding: 1.25rem;
}

/* Form Groups */
.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input, .form-group select, .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border-radius: var(--radius);
    border: 1px solid var(--border-color);
    font-family: inherit;
}

.form-group textarea {
    height: 100px;
    resize: vertical;
}

.trait-sliders {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.trait-slider {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    align-items: center;
    gap: 0.75rem;
}

.trait-slider span {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.trait-slider span:last-child {
    text-align: right;
}

.avatar-selection {
    margin-top: 1.5rem;
}

.avatar-options {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
}

.avatar-option {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;
}

.avatar-option:hover {
    transform: scale(1.05);
}

.avatar-option.selected {
    border-color: var(--primary-color);
}

.refresh-avatars {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: var(--bg-tertiary);
    color: var(--text-secondary);
    transition: all 0.2s ease;
}

.refresh-avatars:hover {
    background-color: rgba(99, 102, 241, 0.1);
    color: var(--primary-color);
}

.create-btn {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--primary-color);
    color: white;
    font-weight: 500;
    border-radius: var(--radius);
    transition: all 0.2s ease;
    margin-top: 1rem;
}

.create-btn:hover {
    background-color: var(--primary-hover);
}

/* Media Queries */
@media (max-width: 1024px) {
    .content {
        flex-direction: column;
    }
    
    .left-sidebar, .right-sidebar {
        flex: none;
        width: 100%;
    }
    
    .left-sidebar {
        order: 1;
    }
    
    .feed-container {
        order: 2;
    }
    
    .right-sidebar {
        order: 3;
    }
}

@media (max-width: 768px) {
    .main-nav {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
    
    .nav-links {
        width: 100%;
        justify-content: space-between;
    }
    
    .user-section {
        width: 100%;
    }
    
    .user-profile {
        width: 100%;
        justify-content: center;
    }
    
    .composer-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .composer-footer {
        flex-direction: column;
        gap: 1rem;
    }
    
    .composer-tools, .post-btn {
        width: 100%;
    }
    
    .post-btn {
        text-align: center;
    }
}