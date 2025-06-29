# Role-Based Authentication System

A fully functional frontend-only authentication system using HTML, CSS, and JavaScript with localStorage as a database.

## 🚀 Features

### Core Authentication
- **Frontend-only** - No backend required
- **localStorage Database** - Persistent user data and sessions
- **Role-based Access Control** - Three user roles: Admin, Seller, Customer
- **Session Management** - Users stay logged in after page refresh
- **Secure Logout** - Clears session and redirects to login

### User Roles & Dashboards
- **Admin Dashboard** (`admin.html`) - Full system access and user management
- **Seller Dashboard** (`seller.html`) - Product and order management
- **Customer Dashboard** (`customer.html`) - Shopping and account management

### Security Features
- **Role Protection** - Each dashboard only accessible by correct role
- **Access Denied** - Unauthorized users see access denied page
- **Input Validation** - Email format, password confirmation, required fields
- **Error Handling** - User-friendly error messages

## 📁 File Structure

```
├── index.html          # Login page
├── register.html       # Registration page (optional)
├── admin.html          # Admin dashboard
├── seller.html         # Seller dashboard
├── customer.html       # Customer dashboard
├── styles.css          # Shared CSS styles
├── auth.js             # Authentication logic
├── login.js            # Login form handler
├── register.js         # Registration form handler
└── README.md           # This file
```

## 🛠️ How to Use

### 1. Quick Start
1. Open `index.html` in your web browser
2. Use one of the demo accounts below to log in
3. You'll be redirected to your role-specific dashboard

### 2. Demo Accounts
```
Admin:    admin@site.com    / admin123
Seller:   seller@site.com   / seller123
Customer: customer@site.com / customer123
```

### 3. Creating New Accounts
1. Click "Create Account" on the login page
2. Fill in your details and select a role
3. Your account will be stored in localStorage
4. You can then log in with your new credentials

## 🔧 Technical Details

### localStorage Structure
```javascript
// Users stored as array of objects
localStorage.users = [
  {
    email: "admin@site.com",
    password: "admin123",
    role: "admin"
  }
]

// Current session
localStorage.loggedInUser = {
  email: "admin@site.com",
  role: "admin",
  loginTime: "2024-01-01T00:00:00.000Z"
}
```

### Authentication Flow
1. User enters credentials on login page
2. System checks against localStorage users
3. If valid, creates session in localStorage
4. Redirects to role-specific dashboard
5. Dashboard checks session and role permissions
6. Logout clears session and redirects to login

### Role Protection
Each dashboard page includes:
```javascript
// Protect page - only specific role can access
if (auth.protectPage('admin')) {
    // Display dashboard content
}
```

## 🎨 UI Features

### Design
- **Modern Gradient Background** - Purple to blue gradient
- **Clean Card Layout** - White cards with subtle shadows
- **Responsive Design** - Works on desktop and mobile
- **Smooth Animations** - Hover effects and transitions

### User Experience
- **Real-time Validation** - Instant feedback on form inputs
- **Success/Error Messages** - Clear communication to users
- **Auto-redirect** - Seamless navigation between pages
- **Session Persistence** - No need to re-login on refresh

## 🔒 Security Considerations

### For Production Use
⚠️ **This is a demo/educational system. For production:**

1. **Never store passwords in plain text** - Use proper hashing
2. **Implement proper session management** - Use secure tokens
3. **Add CSRF protection** - Prevent cross-site request forgery
4. **Use HTTPS** - Encrypt all data transmission
5. **Implement rate limiting** - Prevent brute force attacks
6. **Add input sanitization** - Prevent XSS attacks

### Current Limitations
- Passwords stored in plain text (demo only)
- No password recovery functionality
- No email verification
- localStorage can be manipulated by users
- No server-side validation

## 🚀 Deployment

### Local Development
1. Clone or download the files
2. Open `index.html` in a web browser
3. No server setup required

### Web Server Deployment
1. Upload all files to your web server
2. Ensure all files are in the same directory
3. Access via `index.html`

### GitHub Pages
1. Push code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via the provided GitHub Pages URL

## 🛠️ Customization

### Adding New Roles
1. Add role to registration form in `register.html`
2. Update role checking in `auth.js`
3. Create new dashboard page
4. Add redirect logic in `redirectByRole()`

### Styling Changes
- Modify `styles.css` for visual changes
- Update color scheme in CSS variables
- Add new components as needed

### Functionality Extensions
- Add password recovery
- Implement email verification
- Add user profile management
- Create admin user management interface

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

---

**Note**: This system is designed for educational purposes, demos, and prototypes. For production applications, implement proper security measures and use a real backend with secure authentication. 