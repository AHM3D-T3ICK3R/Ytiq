// YTIQ Authentication System

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = Utils.storage.get('ytiq_user');
        if (savedUser) {
            this.currentUser = savedUser;
            this.isAuthenticated = true;
        }

        this.setupEventListeners();
        this.checkAuthState();
    }

    setupEventListeners() {
        // Modal controls
        document.getElementById('closeAuthModal')?.addEventListener('click', () => {
            this.hideAuthModal();
        });

        // Form toggle
        document.getElementById('toggleAuthMode')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthMode();
        });

        // Demo access
        document.getElementById('demoAccess')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.loginAsDemo();
        });

        // Forms
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });

        // User menu
        document.getElementById('userMenuBtn')?.addEventListener('click', () => {
            this.toggleUserMenu();
        });

        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            const userMenu = document.getElementById('userDropdown');
            const userMenuBtn = document.getElementById('userMenuBtn');
            
            if (userMenu && !userMenuBtn.contains(e.target)) {
                userMenu.classList.add('hidden');
            }
        });
    }

    checkAuthState() {
        if (this.isAuthenticated) {
            this.showApp();
        } else {
            this.showAuthModal();
        }
    }

    showAuthModal() {
        document.getElementById('authModal').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');
    }

    hideAuthModal() {
        document.getElementById('authModal').classList.add('hidden');
        if (this.isAuthenticated) {
            this.showApp();
        }
    }

    showApp() {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('authModal').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        
        this.updateUserInterface();
        
        // Initialize dashboard
        if (window.Dashboard) {
            window.Dashboard.init();
        }
    }

    toggleAuthMode() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const authTitle = document.getElementById('authTitle');
        const toggleBtn = document.getElementById('toggleAuthMode');

        const isLogin = !loginForm.classList.contains('hidden');

        if (isLogin) {
            // Switch to register
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            authTitle.textContent = 'Create YTIQ Account';
            toggleBtn.textContent = 'Already have an account? Sign in';
        } else {
            // Switch to login
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            authTitle.textContent = 'Sign In to YTIQ';
            toggleBtn.textContent = "Don't have an account? Sign up";
        }
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Validate inputs
        if (!email || !password) {
            Utils.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate API call
        try {
            await this.simulateApiCall();
            
            const user = {
                id: Utils.generateId(),
                email,
                name: email.split('@')[0], // Use email prefix as name
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=ef4444&color=fff`,
                plan: 'free',
                joinedAt: new Date().toISOString(),
                channels: []
            };

            this.setCurrentUser(user);
            Utils.showNotification('Successfully signed in!', 'success');
            this.hideAuthModal();
            
        } catch (error) {
            Utils.showNotification('Login failed. Please try again.', 'error');
        }
    }

    async handleRegister(e) {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const channel = document.getElementById('registerChannel').value;

        // Validate inputs
        if (!name || !email || !password) {
            Utils.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Utils.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            Utils.showNotification('Password must be at least 6 characters long', 'error');
            return;
        }

        try {
            await this.simulateApiCall();
            
            const user = {
                id: Utils.generateId(),
                email,
                name,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ef4444&color=fff`,
                plan: 'free',
                joinedAt: new Date().toISOString(),
                channels: channel ? [{ url: channel, connected: false }] : []
            };

            this.setCurrentUser(user);
            Utils.showNotification('Account created successfully!', 'success');
            this.hideAuthModal();
            
        } catch (error) {
            Utils.showNotification('Registration failed. Please try again.', 'error');
        }
    }

    loginAsDemo() {
        const demoUser = {
            id: 'demo-user',
            email: 'demo@ytiq.com',
            name: 'Demo User',
            avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=ef4444&color=fff',
            plan: 'demo',
            joinedAt: new Date().toISOString(),
            channels: [
                {
                    id: 'demo-channel-1',
                    name: 'Tech Reviews Pro',
                    url: 'https://youtube.com/@techreviewspro',
                    connected: true,
                    subscribers: 125000,
                    totalViews: 15600000
                }
            ]
        };

        this.setCurrentUser(demoUser);
        Utils.showNotification('Welcome to YTIQ Demo!', 'success');
        this.hideAuthModal();
    }

    setCurrentUser(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        Utils.storage.set('ytiq_user', user);
        this.updateUserInterface();
    }

    updateUserInterface() {
        if (!this.currentUser) return;

        // Update user avatar and name
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (userAvatar) {
            userAvatar.src = this.currentUser.avatar;
            userAvatar.alt = this.currentUser.name;
        }

        if (userName) {
            userName.textContent = this.currentUser.name;
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.toggle('hidden');
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        Utils.storage.remove('ytiq_user');
        
        // Clear any cached data
        Utils.storage.remove('ytiq_dashboard_data');
        Utils.storage.remove('ytiq_analytics_cache');
        
        Utils.showNotification('Successfully signed out', 'info');
        
        // Redirect to auth modal
        this.showAuthModal();
        
        // Hide user menu
        document.getElementById('userDropdown').classList.add('hidden');
    }

    async simulateApiCall() {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 90% success rate for demo
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1000 + Math.random() * 1000);
        });
    }

    // Get current user info
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user has connected channels
    hasConnectedChannels() {
        return this.currentUser && 
               this.currentUser.channels && 
               this.currentUser.channels.some(channel => channel.connected);
    }

    // Get connected channels
    getConnectedChannels() {
        if (!this.currentUser || !this.currentUser.channels) {
            return [];
        }
        return this.currentUser.channels.filter(channel => channel.connected);
    }

    // Add a channel connection
    async connectChannel(channelUrl) {
        if (!this.currentUser) return false;

        try {
            // Extract channel info from URL (simplified)
            const channelId = Utils.youtube.extractChannelId(channelUrl);
            if (!channelId) {
                throw new Error('Invalid YouTube channel URL');
            }

            // Simulate channel verification
            await this.simulateApiCall();

            // Generate mock channel data
            const channelData = MockData.generateChannelData('Connected Channel');
            channelData.url = channelUrl;
            channelData.connected = true;

            // Add to user's channels
            if (!this.currentUser.channels) {
                this.currentUser.channels = [];
            }

            this.currentUser.channels.push(channelData);
            Utils.storage.set('ytiq_user', this.currentUser);

            Utils.showNotification('Channel connected successfully!', 'success');
            return true;

        } catch (error) {
            Utils.showNotification('Failed to connect channel: ' + error.message, 'error');
            return false;
        }
    }

    // Remove channel connection
    disconnectChannel(channelId) {
        if (!this.currentUser || !this.currentUser.channels) return;

        this.currentUser.channels = this.currentUser.channels.filter(
            channel => channel.id !== channelId
        );

        Utils.storage.set('ytiq_user', this.currentUser);
        Utils.showNotification('Channel disconnected', 'info');
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.Auth = new AuthManager();
});