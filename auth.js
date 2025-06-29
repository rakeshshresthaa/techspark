// Authentication System - Shared Logic
class AuthSystem {
    constructor() {
        this.initializeUsers();
    }

    // Initialize default users in localStorage if they don't exist
    initializeUsers() {
        const existingUsers = localStorage.getItem('users');
        if (!existingUsers) {
            const defaultUsers = [
                { email: 'admin@site.com', password: 'admin123', role: 'admin' },
                { email: 'seller@site.com', password: 'seller123', role: 'seller' },
                { email: 'customer@site.com', password: 'customer123', role: 'customer' }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
    }

    // Get all users from localStorage
    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Add a new user
    addUser(email, password, role) {
        const users = this.getUsers();
        const newUser = { email, password, role };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Authenticate user login
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store logged in user session
            const sessionData = {
                email: user.email,
                role: user.role,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('loggedInUser', JSON.stringify(sessionData));
            return { success: true, user: sessionData };
        } else {
            return { success: false, message: 'Invalid email or password' };
        }
    }

    // Check if user is logged in
    isLoggedIn() {
        const session = localStorage.getItem('loggedInUser');
        return session !== null;
    }

    // Get current logged in user
    getCurrentUser() {
        const session = localStorage.getItem('loggedInUser');
        return session ? JSON.parse(session) : null;
    }

    // Check if user has specific role
    hasRole(requiredRole) {
        const user = this.getCurrentUser();
        return user && user.role === requiredRole;
    }

    // Logout user
    logout() {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    }

    // Redirect based on role
    redirectByRole() {
        const user = this.getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        switch (user.role) {
            case 'admin':
                window.location.href = 'admin.html';
                break;
            case 'seller':
                window.location.href = 'seller.html';
                break;
            case 'customer':
                window.location.href = 'customer.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }

    // Protect page - check if user is logged in and has correct role
    protectPage(requiredRole) {
        if (!this.isLoggedIn()) {
            window.location.href = 'index.html';
            return false;
        }

        if (requiredRole && !this.hasRole(requiredRole)) {
            this.showAccessDenied();
            return false;
        }

        return true;
    }

    // Show access denied message
    showAccessDenied() {
        document.body.innerHTML = `
            <div class="container">
                <div class="login-card">
                    <div class="login-header">
                        <h1>Access Denied</h1>
                        <p>You don't have permission to access this page.</p>
                    </div>
                    <button onclick="window.location.href='index.html'" class="login-btn">Go to Login</button>
                </div>
            </div>
        `;
    }

    // Display user info in dashboard header
    displayUserInfo() {
        const user = this.getCurrentUser();
        if (user) {
            const userInfoElement = document.getElementById('userInfo');
            if (userInfoElement) {
                userInfoElement.innerHTML = `
                    <span class="user-role">${user.role}</span>
                    <span>${user.email}</span>
                    <button onclick="auth.logout()" class="logout-btn">Logout</button>
                `;
            }
        }
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Auto-redirect if already logged in (for login page)
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    if (auth.isLoggedIn()) {
        auth.redirectByRole();
    }
} 