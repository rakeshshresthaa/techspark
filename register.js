// Registration Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    // Show message function
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    // Handle form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        const role = document.getElementById('role').value;

        // Validation
        if (!email || !password || !confirmPassword || !role) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!email.includes('@')) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        // Check if user already exists
        const users = auth.getUsers();
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            showMessage('User with this email already exists', 'error');
            return;
        }

        // Create new user
        try {
            auth.addUser(email, password, role);
            showMessage('Account created successfully! You can now log in.', 'success');
            
            // Clear form
            registerForm.reset();
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            showMessage('Error creating account. Please try again.', 'error');
        }
    });

    // Clear message when user starts typing
    const inputs = registerForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (messageDiv.style.display === 'block') {
                messageDiv.style.display = 'none';
            }
        });
    });
}); 