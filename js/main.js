/**
 * Main & Global UI Logic
 * E-Commerce College Major Project
 */

// Show Toast Notification
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';

    toast.innerHTML = `
        <i class="fas ${iconClass}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Update Cart Badge Counter across header
function updateCartBadge() {
    const badge = document.getElementById('cart-badge-count');
    if (!badge) return;
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Update Header Navigation depending on Auth state
function updateHeaderNav() {
    const navActions = document.getElementById('user-nav-actions');
    if (!navActions) return;

    const currentUser = getCurrentUser();
    if (currentUser) {
        navActions.innerHTML = `
            <a href="${getRelativePath('pages/cart.html')}" class="cart-icon-btn" title="View Cart">
                <i class="fas fa-shopping-cart"></i>
                <span id="cart-badge-count" class="cart-badge">0</span>
            </a>
            <a href="${getRelativePath('pages/my-orders.html')}" class="nav-link">
                <i class="fas fa-box"></i> My Orders
            </a>
            <a href="${getRelativePath('pages/profile.html')}" class="nav-link">
                <i class="fas fa-user-circle"></i> ${currentUser.name.split(' ')[0]}
            </a>
            <button onclick="handleUserLogout()" class="btn btn-secondary btn-sm">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
    } else {
        navActions.innerHTML = `
            <a href="${getRelativePath('pages/cart.html')}" class="cart-icon-btn" title="View Cart">
                <i class="fas fa-shopping-cart"></i>
                <span id="cart-badge-count" class="cart-badge">0</span>
            </a>
            <a href="${getRelativePath('pages/login.html')}" class="btn btn-outline btn-sm">Login</a>
            <a href="${getRelativePath('pages/register.html')}" class="btn btn-primary btn-sm">Register</a>
        `;
    }
    updateCartBadge();
}

// Path Helper to fix relative URLs across root and subfolders
function getRelativePath(targetPath) {
    const isSubfolder = window.location.pathname.includes('/pages/');
    const isAdminSubfolder = window.location.pathname.includes('/pages/admin/');
    
    if (isAdminSubfolder) {
        if (targetPath.startsWith('pages/admin/')) return targetPath.replace('pages/admin/', '');
        if (targetPath.startsWith('pages/')) return '../' + targetPath.replace('pages/', '');
        return '../../' + targetPath;
    } else if (isSubfolder) {
        if (targetPath.startsWith('pages/')) return targetPath.replace('pages/', '');
        return '../' + targetPath;
    } else {
        return targetPath;
    }
}

// User Logout Handler
function handleUserLogout() {
    removeCurrentUser();
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = getRelativePath('pages/login.html');
    }, 800);
}

// Mobile Menu Toggle Handler
function setupMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderNav();
    setupMobileMenu();
});
