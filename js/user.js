/**
 * User Profile Logic
 * E-Commerce College Major Project
 */

function initUserProfile() {
    checkRouteProtection('user');

    const user = getCurrentUser();
    if (!user) return;

    const allOrders = getOrders();
    const userOrders = allOrders.filter(o => o.userId === user.id || o.userEmail === user.email);

    const profileContainer = document.getElementById('profile-content');
    if (!profileContainer) return;

    profileContainer.innerHTML = `
        <div class="checkout-section" style="max-width: 650px; margin: 2rem auto;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="width:90px; height:90px; background:var(--primary-light); color:var(--primary); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2.5rem; margin: 0 auto 1rem auto;">
                    <i class="fas fa-user"></i>
                </div>
                <h2>${user.name}</h2>
                <p style="color:var(--text-secondary);">${user.email}</p>
            </div>

            <div class="order-receipt-box" style="margin-bottom: 2rem;">
                <div class="receipt-row">
                    <span><i class="fas fa-user"></i> Full Name:</span>
                    <strong>${user.name}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fas fa-envelope"></i> Email Address:</span>
                    <span>${user.email}</span>
                </div>
                <div class="receipt-row">
                    <span><i class="fas fa-phone"></i> Phone Number:</span>
                    <span>${user.phone || 'N/A'}</span>
                </div>
                <div class="receipt-row">
                    <span><i class="fas fa-shopping-bag"></i> Total Orders Placed:</span>
                    <strong style="color:var(--primary);">${userOrders.length} Order(s)</strong>
                </div>
            </div>

            <div style="display:flex; gap:1rem;">
                <a href="${getRelativePath('pages/my-orders.html')}" class="btn btn-outline" style="flex:1;">
                    <i class="fas fa-box"></i> View My Orders
                </a>
                <button onclick="handleUserLogout()" class="btn btn-danger" style="flex:1;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    initUserProfile();
});
