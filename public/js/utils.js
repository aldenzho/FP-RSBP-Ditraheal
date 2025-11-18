// Utility functions
const Utils = {
    // Show message
    showMessage: function(elementId, message, type) {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `message ${type}`;
            messageElement.classList.remove('hidden');
            
            setTimeout(() => {
                messageElement.classList.add('hidden');
            }, 5000);
        }
    },

    // Validate email
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Get current user from localStorage
    getCurrentUser: function() {
        return JSON.parse(localStorage.getItem('currentUser'));
    },

    // Check if user is logged in
    isLoggedIn: function() {
        return !!localStorage.getItem('currentUser');
    },

    // Redirect if not logged in
    requireAuth: function() {
        if (!this.isLoggedIn()) {
            window.location.href = '/login';
            return false;
        }
        return true;
    },

    // Format date
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// API functions
const API = {
    baseURL: '', // Same origin

    // Generic request method
    request: async function(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('API request failed:', error);
            return { success: false, data: { message: 'Network error' } };
        }
    },

    // Auth endpoints
    login: async function(email, password) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    register: async function(userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // User endpoints
    getProfile: async function() {
        return this.request('/api/users/profile');
    },

    updateProfile: async function(profileData) {
        return this.request('/api/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }
};