let authToken = null;
let baseUrl = 'https://modion.onrender.com/api';

// DOM elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const responseArea = document.getElementById('responseArea');
const baseUrlInput = document.getElementById('baseUrl');
const authStatus = document.getElementById('authStatus');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        authToken = savedToken;
        showDashboard();
    }

    // Update base URL when changed
    baseUrlInput.addEventListener('change', function() {
        baseUrl = this.value;
    });

    // Setup form event listeners
    setupFormListeners();
    
    // Add ripple effect to buttons
    addRippleEffect();
});

// Setup form event listeners
function setupFormListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Create article form
    document.getElementById('createArticleForm').addEventListener('submit', handleCreateArticle);
    
    // Update article form
    document.getElementById('updateArticleForm').addEventListener('submit', handleUpdateArticle);
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');
    
    try {
        showLoading('Authenticating...');
        
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            loginError.classList.add('hidden');
            showDashboard();
            showSuccess('Login successful!');
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        showError(`Login failed: ${error.message}`);
        loginError.textContent = error.message;
        loginError.classList.remove('hidden');
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    showLogin();
    showResponse('Logged out successfully');
}

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    updateAuthStatus(true);
}

function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    updateAuthStatus(false);
}

function updateAuthStatus(isAuthenticated) {
    const statusElement = document.getElementById('authStatus');
    if (isAuthenticated) {
        statusElement.className = 'auth-status authenticated';
        statusElement.innerHTML = `
            <span>✅</span>
            <span>Authenticated</span>
            <button class="btn btn-secondary" onclick="logout()" style="margin-left: auto;">Logout</button>
        `;
    } else {
        statusElement.className = 'auth-status unauthenticated';
        statusElement.innerHTML = `
            <span>❌</span>
            <span>Not Authenticated</span>
        `;
    }
}

// API Helper function
async function apiRequest(endpoint, options = {}) {
    const url = `${baseUrl}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return { success: true, data, status: response.status };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Article API functions
async function getAllArticles() {
    showLoading('Fetching all articles...');
    
    const result = await apiRequest('/articles');
    
    if (result.success) {
        showResponse(JSON.stringify(result.data, null, 2));
        showSuccess(`Found ${result.data.length || 0} articles`);
    } else {
        showError(`Failed to fetch articles: ${result.error}`);
    }
}

async function getFeaturedArticles() {
    showLoading('Fetching featured articles...');
    
    const result = await apiRequest('/articles/featured');
    
    if (result.success) {
        showResponse(JSON.stringify(result.data, null, 2));
        showSuccess(`Found ${result.data.length || 0} featured articles`);
    } else {
        showError(`Failed to fetch featured articles: ${result.error}`);
    }
}

async function getCategories() {
    showLoading('Fetching categories...');
    
    const result = await apiRequest('/articles/categories');
    
    if (result.success) {
        showResponse(JSON.stringify(result.data, null, 2));
        showSuccess('Categories fetched successfully');
    } else {
        showError(`Failed to fetch categories: ${result.error}`);
    }
}

async function searchArticles() {
    const query = document.getElementById('searchQuery').value.trim();
    
    if (!query) {
        showError('Please enter a search query');
        return;
    }
    
    showLoading(`Searching for "${query}"...`);
    
    const result = await apiRequest(`/articles/search?q=${encodeURIComponent(query)}`);
    
    if (result.success) {
        showResponse(JSON.stringify(result.data, null, 2));
        showSuccess(`Found ${result.data.length || 0} articles matching "${query}"`);
    } else {
        showError(`Search failed: ${result.error}`);
    }
}

async function getArticleById() {
    const id = document.getElementById('articleId').value.trim();
    
    if (!id) {
        showError('Please enter an article ID');
        return;
    }
    
    showLoading(`Fetching article ${id}...`);
    
    const result = await apiRequest(`/articles/${id}`);
    
    if (result.success) {
        showResponse(JSON.stringify(result.data, null, 2));
        showSuccess(`Article ${id} fetched successfully`);
    } else {
        showError(`Failed to fetch article: ${result.error}`);
    }
}

async function getArticlesByCategory() {
    const category = document.getElementById('categorySelect').value;
    
    showLoading(`Fetching ${category} articles...`);
    
    const result = await apiRequest(`/articles/category/${category}`);
    
    if (result.success) {
        showResponse(JSON.stringify(result.data, null, 2));
        showSuccess(`Found ${result.data.length || 0} articles in ${category} category`);
    } else {
        showError(`Failed to fetch articles: ${result.error}`);
    }
}

async function handleCreateArticle(e) {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Get form values
    const title = document.getElementById('createTitle').value;
    const category = document.getElementById('createCategory').value;
    const image = document.getElementById('createImage').files[0];
    const author = document.getElementById('createAuthor').value;
    const readingTime = document.getElementById('createReadingTime').value;
    const tags = document.getElementById('createTags').value;
    const metaDescription = document.getElementById('createMetaDescription').value;
    const sections = document.getElementById('createSections').value;
    const featured = document.getElementById('createFeatured').checked;
    const status = document.getElementById('createStatus').value;
    
    // Validate required fields
    if (!title || !category || !image || !author || !readingTime || !sections) {
        showError('Please fill in all required fields');
        return;
    }
    
    // Validate JSON
    try {
        JSON.parse(sections);
    } catch (error) {
        showError('Invalid JSON format in sections field');
        return;
    }
    
    // Build FormData
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', image);
    formData.append('author', author);
    formData.append('reading_time', readingTime);
    formData.append('meta_description', metaDescription);
    formData.append('sections', sections);
    formData.append('featured', featured);
    formData.append('status', status);
    
    if (tags) {
        formData.append('tags', tags);
    }
    
    showLoading('Creating article...');
    
    try {
        const response = await fetch(`${baseUrl}/articles`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authToken}`
              },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showResponse(JSON.stringify(data, null, 2));
            showSuccess('Article created successfully!');
            document.getElementById('createArticleForm').reset();
        } else {
            throw new Error(data.message || 'Failed to create article');
        }
    } catch (error) {
        showError(`Failed to create article: ${error.message}`);
    }
}

async function handleUpdateArticle(e) {
    e.preventDefault();
    
    const id = document.getElementById('updateId').value.trim();
    
    if (!id) {
        showError('Please enter an article ID to update');
        return;
    }
    
    const formData = new FormData();
    
    // Get form values (only add non-empty values)
    const title = document.getElementById('updateTitle').value;
    const category = document.getElementById('updateCategory').value;
    const image = document.getElementById('updateImage').files[0];
    const sections = document.getElementById('updateSections').value;
    
    if (title) formData.append('title', title);
    if (category) formData.append('category', category);
    if (image) formData.append('image', image);
    if (sections) {
        try {
            JSON.parse(sections);
            formData.append('sections', sections);
        } catch (error) {
            showError('Invalid JSON format in sections field');
            return;
        }
    }
    
    showLoading(`Updating article ${id}...`);
    
    try {
        const response = await fetch(`${baseUrl}/articles/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authToken}`
              },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showResponse(JSON.stringify(data, null, 2));
            showSuccess(`Article ${id} updated successfully!`);
            document.getElementById('updateArticleForm').reset();
        } else {
            throw new Error(data.message || 'Failed to update article');
        }
    } catch (error) {
        showError(`Failed to update article: ${error.message}`);
    }
}

async function deleteArticle() {
    const id = document.getElementById('deleteId').value.trim();
    
    if (!id) {
        showError('Please enter an article ID to delete');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete article ${id}? This action cannot be undone.`)) {
        return;
    }
    
    showLoading(`Deleting article ${id}...`);
    
    const result = await apiRequest(`/articles/${id}`, {
        method: 'DELETE'
    });
    
    if (result.success) {
        showResponse(JSON.stringify(result.data, null, 2));
        showSuccess(`Article ${id} deleted successfully!`);
        document.getElementById('deleteId').value = '';
    } else {
        showError(`Failed to delete article: ${result.error}`);
    }
}

// UI Helper functions
function showResponse(content) {
    responseArea.textContent = content;
    responseArea.scrollTop = 0;
}

function showLoading(message) {
    responseArea.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; color: var(--primary);">
            <div class="loading"></div>
            <span>${message}</span>
        </div>
    `;
}

function showError(message) {
    responseArea.innerHTML = `
        <div style="color: var(--error); padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);">
            <strong>Error:</strong> ${message}
        </div>
    `;
}

function showSuccess(message) {
    // Show temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.right = '20px';
    successDiv.style.zIndex = '1000';
    successDiv.style.animation = 'slideInRight 0.3s ease';
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

// Add ripple effect to buttons
function addRippleEffect() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            const button = e.target;
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
}

// Add CSS animations for success messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Utility functions
function formatJSON(obj) {
    try {
        return JSON.stringify(obj, null, 2);
    } catch (error) {
        return 'Invalid JSON';
    }
}

function validateObjectId(id) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
}

// Form validation helpers
function validateForm(formId) {
    const form = document.getElementById(formId);
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
            field.classList.add('success');
        }
    });
    
    return isValid;
}

// Clear form validation styles
function clearValidation(formId) {
    const form = document.getElementById(formId);
    const fields = form.querySelectorAll('.form-control');
    
    fields.forEach(field => {
        field.classList.remove('error', 'success');
    });
}

// Auto-save draft functionality
let draftTimer = null;

function enableAutoSave(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(draftTimer);
            draftTimer = setTimeout(() => {
                saveDraft(formId);
            }, 2000);
        });
    });
}

function saveDraft(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const draft = {};
    
    for (let [key, value] of formData.entries()) {
        draft[key] = value;
    }
    
    localStorage.setItem(`draft_${formId}`, JSON.stringify(draft));
    console.log('Draft saved for', formId);
}

function loadDraft(formId) {
    const draft = localStorage.getItem(`draft_${formId}`);
    
    if (draft) {
        const data = JSON.parse(draft);
        const form = document.getElementById(formId);
        
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field && field.type !== 'file') {
                field.value = data[key];
            }
        });
    }
}

// Initialize auto-save for create and update forms
document.addEventListener('DOMContentLoaded', () => {
    enableAutoSave('createArticleForm');
    enableAutoSave('updateArticleForm');
});