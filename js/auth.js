/**
 * Authentication Module (User & Admin Auth Guard & Form Handlers)
 * E-Commerce College Major Project
 */

// User Registration Form Handler
function handleRegister(event) {
    event.preventDefault();

    const fullName = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    // Validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    // Phone validation simple regex
    if (!/^\d{10,15}$/.test(phone.replace(/[- ]/g, ''))) {
        showToast('Please enter a valid phone number', 'error');
        return;
    }

    const users = getUsers();
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        showToast('An account with this email already exists', 'error');
        return;
    }

    // Save new user
    const newUser = {
        id: 'user_' + Date.now(),
        name: fullName,
        email: email,
        phone: phone,
        password: password, // Note: In production, pass password to backend for bcrypt hashing
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    showToast('Registration successful! Redirecting to login...', 'success');
    setTimeout(() => {
        window.location.href = getRelativePath('pages/login.html');
    }, 1500);
}

// User Login Form Handler
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showToast('Invalid email or password', 'error');
        return;
    }

    // Store Session
    saveCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
    });

    showToast(`Welcome back, ${user.name}!`, 'success');
    setTimeout(() => {
        window.location.href = getRelativePath('index.html');
    }, 1200);
}

// Route Protection Guards
function checkRouteProtection(requiredRole = 'user') {
    if (requiredRole === 'user' && !isUserLoggedIn()) {
        showToast('Please log in to access this page', 'warning');
        setTimeout(() => {
            window.location.href = getRelativePath('pages/login.html');
        }, 1000);
    } else if (requiredRole === 'admin' && !isAdminLoggedIn()) {
        showToast('Admin access restricted. Please log in.', 'error');
        setTimeout(() => {
            window.location.href = getRelativePath('pages/admin/login.html');
        }, 1000);
    }
}
