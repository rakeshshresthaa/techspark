// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
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
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validation
        if (!email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!email.includes('@')) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Attempt login
        const result = auth.login(email, password);
        
        if (result.success) {
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect after a short delay
            setTimeout(() => {
                auth.redirectByRole();
            }, 1000);
        } else {
            showMessage(result.message || 'Login failed. Please check your credentials.', 'error');
        }
    });

    // Clear message when user starts typing
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (messageDiv.style.display === 'block') {
                messageDiv.style.display = 'none';
            }
        });
    });
}); 